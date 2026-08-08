import { create } from "zustand";
import { format } from "date-fns";
import {
  autosuggest,
  createCorrelationId,
  getHotelContent,
  getLocationDetails,
  isZentrumConfigured,
  pollUntilComplete,
  searchInit,
  zentrumConfig,
  ZentrumApiError,
  type HotelAvailability,
  type HotelContentItem,
  type LocationSuggestionZh,
  type LocationType,
  type Occupancy,
} from "@/services/zentrumhub";

export interface SearchDestination {
  id: string;
  label: string;
  city: string;
  state?: string;
  country: string;
  type?: LocationType;
  referenceId?: string | null;
  coordinates?: { lat: number; long: number };
}

export interface SearchCriteria {
  destination: SearchDestination | null;
  checkIn: string;
  checkOut: string;
  occupancies: Occupancy[];
  currency: string;
  nationality?: string;
  countryOfResidence?: string;
}

export interface SearchHotelResult {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  image: string;
  /** Guest review score from content API (e.g. 4.3). */
  rating: number;
  /** Number of guest reviews. */
  reviewCount: number;
  /** Official hotel star class (may be fractional, e.g. 3.5). */
  starRating: number;
  latitude: number | null;
  longitude: number | null;
  /** Stay total in search currency. */
  totalRate: number;
  /** Published/list rate when available (for strikethrough). */
  publishedRate: number;
  /** Rate components from search availability (same currency as totalRate). */
  baseRate: number;
  taxes: number;
  fees: number;
  discounts: number;
  currency: string;
  freeBreakfast?: boolean;
  freeCancellation?: boolean;
  refundable?: boolean;
  payAtHotel?: boolean;
  boardBasisLabel?: string;
  offerLabel?: string;
  /** Short amenity labels for card pills (derived from facilities + options). */
  amenityPills: string[];
  /** Guest-facing attribute highlights (e.g. eco / theme). */
  highlightAttributes: string[];
  /** Raw facility names for filter matching. */
  amenities: string[];
}

interface SearchStoreState {
  criteria: SearchCriteria | null;
  /** Fingerprint of the last search that was started (dedupe). */
  criteriaKey: string | null;
  token: string | null;
  correlationId: string | null;
  status: "idle" | "init" | "polling" | "completed" | "error";
  hotels: SearchHotelResult[];
  contentById: Record<string, HotelContentItem>;
  expectedHotelCount: number;
  completedHotelCount: number;
  currency: string;
  error: string | null;
  retryAfterSeconds: number | null;
  abortController: AbortController | null;

  setDestination: (destination: SearchDestination | null) => void;
  runSearch: (criteria: SearchCriteria, options?: { force?: boolean }) => Promise<void>;
  /**
   * Re-init availability for a single hotel in a new currency.
   * Required on hotel detail when the guest changes currency — rooms/rates
   * tokens are currency-scoped and cannot be client-FX'd.
   */
  repriceHotel: (
    hotelId: string,
    currency: string,
    options?: {
      checkIn?: string;
      checkOut?: string;
      occupancies?: Occupancy[];
    }
  ) => Promise<void>;
  reset: () => void;
}

export function searchCriteriaKey(criteria: SearchCriteria): string {
  const dest = criteria.destination;
  return JSON.stringify({
    checkIn: criteria.checkIn,
    checkOut: criteria.checkOut,
    currency: criteria.currency,
    occupancies: criteria.occupancies,
    destination: dest
      ? {
          id: dest.id,
          type: dest.type,
          referenceId: dest.referenceId,
          lat: dest.coordinates?.lat,
          long: dest.coordinates?.long,
          city: dest.city,
        }
      : null,
  });
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

function cityTypes(type?: LocationType): boolean {
  return (
    type === "City" ||
    type === "MultiCity" ||
    type === "Region" ||
    type === "Neighborhood" ||
    type === "Area" ||
    type === "State"
  );
}

function circularTypes(type?: LocationType): boolean {
  return (
    type === "PointOfInterest" ||
    type === "Airport" ||
    type === "TrainStation" ||
    type === "BusStation"
  );
}

function extractContentImages(content?: HotelContentItem): string[] {
  if (!content) return [];
  const urls: string[] = [];
  if (content.heroImage) urls.push(content.heroImage);

  for (const img of content.images ?? []) {
    const links = img.links ?? [];
    const preferred =
      links.find((l) => /xl|xxl|standard|large|huge/i.test(l.size ?? "")) ??
      links.find((l) => Boolean(l.url)) ??
      null;
    if (preferred?.url) urls.push(preferred.url);
    if (img.url) urls.push(img.url);
    for (const link of links) {
      if (link.url) urls.push(link.url);
    }
  }

  return [...new Set(urls.filter(Boolean))];
}

function contentHasName(content?: HotelContentItem): boolean {
  return Boolean(content?.name?.trim());
}

function parseContentReviews(content?: HotelContentItem): { rating: number; count: number } {
  const reviews = content?.reviews;
  if (!reviews) return { rating: 0, count: 0 };

  const entry = Array.isArray(reviews) ? reviews[0] : reviews;
  if (!entry) return { rating: 0, count: 0 };

  const rating = Number(entry.rating ?? entry.Rating ?? 0);
  const count = Number(entry.count ?? 0);

  return {
    rating: Number.isFinite(rating) && rating > 0 ? rating : 0,
    count: Number.isFinite(count) && count > 0 ? count : 0,
  };
}

const AMENITY_PILL_RULES: Array<{ match: RegExp; label: string }> = [
  { match: /wifi|wi-?fi|wireless/i, label: "WiFi" },
  { match: /\bpool\b|swimming/i, label: "Pool" },
  { match: /\bspa\b|sauna|massage/i, label: "Spa" },
  { match: /parking/i, label: "Parking" },
  { match: /gym|fitness/i, label: "Gym" },
  { match: /restaurant/i, label: "Restaurant" },
  { match: /breakfast/i, label: "Breakfast" },
  { match: /air.?condition|a\/c|\bac\b/i, label: "A/C" },
  { match: /concierge/i, label: "Concierge" },
  { match: /elevator|lift/i, label: "Elevator" },
  { match: /business\s*center/i, label: "Business center" },
  { match: /laundry/i, label: "Laundry" },
];

function deriveAmenityPills(
  facilityNames: string[],
  options?: HotelAvailability["options"],
  boardBasisLabel?: string
): string[] {
  const pills: string[] = [];
  const push = (label: string) => {
    if (!pills.includes(label)) pills.push(label);
  };

  if (options?.freeBreakfast) push("Breakfast");
  if (boardBasisLabel && /breakfast/i.test(boardBasisLabel)) push("Breakfast");

  for (const name of facilityNames) {
    for (const rule of AMENITY_PILL_RULES) {
      if (rule.match.test(name)) {
        push(rule.label);
        break;
      }
    }
    if (pills.length >= 6) break;
  }

  return pills.slice(0, 6);
}

function deriveHighlightAttributes(
  attributes: Array<{ key?: string | null; value?: string | null }> | null | undefined
): string[] {
  if (!attributes?.length) return [];

  const highlights: string[] = [];
  for (const attr of attributes) {
    const value = attr.value?.trim();
    if (!value) continue;
    const key = attr.key ?? "";
    // Skip internal/supplier flags; keep guest-facing themes and eco-style attributes.
    if (/expedia_collect|property_collect|updated_|Rank|cribs|rollaway|pets_|noise-free/i.test(key)) {
      continue;
    }
    if (/^(True|False)$/i.test(value)) continue;
    if (/^\d+$/.test(value)) continue;

    if (
      /eco|green|sustain|environment|leaf/i.test(value) ||
      /themes_/i.test(key) ||
      /professional property host/i.test(value)
    ) {
      highlights.push(value);
    }
  }

  return highlights.slice(0, 2);
}

function mapContent(hotel: HotelAvailability, content?: HotelContentItem, currency = "USD"): SearchHotelResult {
  const address = content?.contact?.address;
  const images = extractContentImages(content);
  // Keep fractional star class from content (e.g. 3.5); do not use guest reviews as stars.
  const rawStars = Number(content?.starRating ?? 0);
  const starRating =
    Number.isFinite(rawStars) && rawStars > 0 ? Math.min(5, rawStars) : 0;
  const { rating: reviewRating, count: reviewCount } = parseContentReviews(content);
  const name = content?.name?.trim() || null;
  const facilityNames = (content?.facilities ?? [])
    .map((f) => f.name)
    .filter((n): n is string => Boolean(n));

  const boardBasisLabel =
    hotel.rate?.boardBasis?.description?.trim() ||
    undefined;
  const offer =
    hotel.rate?.offer ??
    (Array.isArray(hotel.rate?.offers) ? hotel.rate.offers[0] : undefined);
  const offerLabel =
    offer?.description?.trim() ||
    offer?.title?.trim() ||
    undefined;

  const freeBreakfast = hotel.options?.freeBreakfast ?? undefined;
  const freeCancellation = hotel.options?.freeCancellation ?? undefined;
  const refundable = hotel.options?.refundable ?? undefined;

  return {
    id: hotel.id!,
    name: name || `Hotel ${hotel.id}`,
    address: address?.line1 ?? "",
    city: address?.city?.name ?? "",
    country: address?.country?.name ?? "",
    image: images[0] || FALLBACK_IMAGE,
    rating: reviewRating,
    reviewCount,
    starRating,
    latitude: content?.geoCode?.lat ?? null,
    longitude: content?.geoCode?.long ?? null,
    totalRate: hotel.rate?.totalRate ?? hotel.rate?.publishedRate ?? hotel.rate?.baseRate ?? 0,
    publishedRate: hotel.rate?.publishedRate ?? 0,
    baseRate: hotel.rate?.baseRate ?? 0,
    taxes: hotel.rate?.taxes ?? 0,
    fees: hotel.rate?.fees ?? 0,
    discounts: hotel.rate?.discounts ?? 0,
    currency,
    freeBreakfast,
    freeCancellation,
    refundable,
    payAtHotel: hotel.options?.payAtHotel ?? hotel.rate?.payAtHotel ?? undefined,
    boardBasisLabel,
    offerLabel,
    amenityPills: deriveAmenityPills(facilityNames, hotel.options, boardBasisLabel),
    highlightAttributes: deriveHighlightAttributes(content?.attributes),
    amenities: facilityNames,
  };
}

async function fetchContentChunks(
  hotelIds: string[],
  correlationId: string,
  existing: Record<string, HotelContentItem>
): Promise<Record<string, HotelContentItem>> {
  const contentById = { ...existing };
  const missing = hotelIds.filter((id) => !contentHasName(contentById[id]));

  for (let i = 0; i < missing.length; i += 50) {
    const chunk = missing.slice(i, i + 50);
    if (!chunk.length) continue;
    try {
      const { data } = await getHotelContent(chunk, { correlationId });
      for (const hotel of data.hotels ?? []) {
        const id = hotel.id != null ? String(hotel.id) : null;
        if (id) contentById[id] = hotel;
      }
    } catch {
      /* best-effort */
    }
  }

  return contentById;
}

async function resolveDestination(dest: SearchDestination): Promise<SearchDestination> {
  if (dest.type === "Hotel" && (dest.referenceId || dest.id)) return dest;
  if (dest.coordinates && dest.type) return dest;
  if (cityTypes(dest.type) && dest.id) return dest;
  if (circularTypes(dest.type) && dest.coordinates) return dest;

  const term = dest.label || dest.city || dest.id;
  if (!term || term.length < 2) return dest;

  try {
    const { data } = await autosuggest(term, { size: 5 });
    const match =
      data.locationSuggestions?.find(
        (s) =>
          (s.id && s.id === dest.id) ||
          (s.name && s.name.toLowerCase() === dest.city.toLowerCase()) ||
          (s.fullName && s.fullName.toLowerCase().includes(dest.city.toLowerCase()))
      ) ?? data.locationSuggestions?.[0];

    if (!match) return dest;

    return {
      id: match.id ?? match.referenceId ?? dest.id,
      label: match.fullName || match.name || dest.label,
      city: match.city || match.name || dest.city,
      state: match.state ?? dest.state,
      country: match.country || dest.country,
      type: match.type ?? dest.type,
      referenceId: match.referenceId ?? dest.referenceId,
      coordinates: match.coordinates ?? dest.coordinates,
    };
  } catch {
    return dest;
  }
}

async function buildInitPayload(criteria: SearchCriteria) {
  const dest = criteria.destination
    ? await resolveDestination(criteria.destination)
    : null;
  if (!dest) throw new Error("Select a destination before searching");

  const base = {
    checkIn: criteria.checkIn,
    checkOut: criteria.checkOut,
    occupancies: criteria.occupancies,
    currency: criteria.currency,
    nationality: criteria.nationality,
    countryOfResidence: criteria.countryOfResidence,
    destinationCountryCode: dest.country?.length === 2 ? dest.country : undefined,
  };

  if (dest.type === "Hotel") {
    const hotelId = dest.referenceId || dest.id;
    if (!hotelId) throw new Error("Hotel destination is missing an id");
    return { ...base, hotelIds: [hotelId] };
  }

  if (cityTypes(dest.type) && dest.id) {
    const { data: location } = await getLocationDetails(dest.id);
    const boundaries = location.boundaries ?? [];
    if (boundaries.length > 1) {
      return {
        ...base,
        multiPolygonalRegion: {
          polygons: boundaries.map((coordinates) => ({ coordinates })),
        },
      };
    }
    if (boundaries[0]?.length) {
      return {
        ...base,
        polygonalRegion: { coordinates: boundaries[0] },
      };
    }
    if (location.coordinates || dest.coordinates) {
      const c = location.coordinates ?? dest.coordinates!;
      return {
        ...base,
        circularRegion: {
          centerLat: c.lat,
          centerLong: c.long,
          radiusInKM: zentrumConfig.circularRadiusKm,
        },
      };
    }
  }

  if (dest.coordinates) {
    return {
      ...base,
      circularRegion: {
        centerLat: dest.coordinates.lat,
        centerLong: dest.coordinates.long,
        radiusInKM: zentrumConfig.circularRadiusKm,
      },
    };
  }

  throw new Error(
    "Unable to resolve search geography. Pick a destination from the suggestions list."
  );
}

export function toSearchDestination(suggestion: LocationSuggestionZh): SearchDestination {
  return {
    id: suggestion.id ?? suggestion.referenceId ?? "",
    label: suggestion.fullName || suggestion.name || "",
    city: suggestion.city || suggestion.name || "",
    state: suggestion.state ?? undefined,
    country: suggestion.country || "",
    type: suggestion.type,
    referenceId: suggestion.referenceId,
    coordinates: suggestion.coordinates,
  };
}

export function formatDateForApi(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  criteria: null,
  criteriaKey: null,
  token: null,
  correlationId: null,
  status: "idle",
  hotels: [],
  contentById: {},
  expectedHotelCount: 0,
  completedHotelCount: 0,
  currency: zentrumConfig.defaultCurrency,
  error: null,
  retryAfterSeconds: null,
  abortController: null,

  setDestination: (destination) => {
    const criteria = get().criteria;
    set({
      criteria: criteria
        ? { ...criteria, destination }
        : {
            destination,
            checkIn: "",
            checkOut: "",
            occupancies: [{ numOfAdults: 2 }],
            currency: zentrumConfig.defaultCurrency,
          },
    });
  },

  runSearch: async (criteria, options) => {
    if (!isZentrumConfigured()) {
      set({
        status: "error",
        error:
          "ZentrumHub credentials missing. Add API key, account ID, and channel ID to .env.local",
        retryAfterSeconds: null,
      });
      return;
    }

    const key = searchCriteriaKey(criteria);
    const current = get();

    // Skip duplicate in-flight / completed searches unless forced (Update Search / reload).
    if (
      !options?.force &&
      current.criteriaKey === key &&
      (current.status === "init" ||
        current.status === "polling" ||
        current.status === "completed")
    ) {
      return;
    }

    current.abortController?.abort();
    const abortController = new AbortController();
    const correlationId = createCorrelationId();

    set({
      criteria,
      criteriaKey: key,
      status: "init",
      hotels: [],
      contentById: {},
      token: null,
      correlationId,
      error: null,
      retryAfterSeconds: null,
      abortController,
      expectedHotelCount: 0,
      completedHotelCount: 0,
      currency: criteria.currency,
    });

    try {
      if (abortController.signal.aborted) return;

      const initBody = await buildInitPayload(criteria);
      if (abortController.signal.aborted) return;

      const { data: init } = await searchInit(initBody, { correlationId });
      if (abortController.signal.aborted) return;

      const token = init.token;
      if (!token) throw new Error("Search init did not return a token");

      set({ token, status: "polling" });

      // Fetch static content once up-front for the first batch of hotel ids later;
      // poll loop only fills gaps to reduce API pressure.
      await pollUntilComplete(token, {
        correlationId,
        signal: abortController.signal,
        onBatch: async (batch, hotelsById) => {
          const ids = Array.from(hotelsById.keys()).map(String);
          let contentById = { ...get().contentById };

          // One content chunk per poll tick keeps rate limits happy while names fill in
          const missing = ids.filter((id) => !contentHasName(contentById[id]));
          const chunk = missing.slice(0, 50);
          if (chunk.length) {
            try {
              const { data } = await getHotelContent(chunk, { correlationId });
              for (const hotel of data.hotels ?? []) {
                const id = hotel.id != null ? String(hotel.id) : null;
                if (id) contentById[id] = hotel;
              }
            } catch {
              /* content is best-effort while rates stream in */
            }
          }

          const currency = batch.currency ?? get().currency;
          const hotels = Array.from(hotelsById.values())
            .filter((h) => h.id)
            .map((h) => mapContent(h, contentById[String(h.id)], currency));

          set({
            contentById,
            hotels,
            currency,
            expectedHotelCount: batch.expectedHotelCount ?? get().expectedHotelCount,
            completedHotelCount: batch.completedHotelCount ?? get().completedHotelCount,
          });
        },
      });

      if (abortController.signal.aborted) return;

      // After rates complete, finish hydrating any hotels still missing names/photos.
      // Preserve full rate fields from the availability map — do not remap with totalRate only.
      const availabilityHotels = get().hotels;
      const allIds = availabilityHotels.map((h) => h.id);
      const hydrated = await fetchContentChunks(allIds, correlationId, get().contentById);
      const remapped = availabilityHotels.map((h) => {
        const next = mapContent(
          {
            id: h.id,
            rate: {
              totalRate: h.totalRate,
              publishedRate: h.publishedRate,
              baseRate: h.baseRate,
              taxes: h.taxes,
              fees: h.fees,
              discounts: h.discounts,
              boardBasis: h.boardBasisLabel
                ? { description: h.boardBasisLabel }
                : undefined,
              offer: h.offerLabel ? { description: h.offerLabel } : undefined,
              payAtHotel: h.payAtHotel,
            },
            options: {
              freeBreakfast: h.freeBreakfast,
              freeCancellation: h.freeCancellation,
              refundable: h.refundable,
              payAtHotel: h.payAtHotel,
            },
          },
          hydrated[h.id],
          h.currency
        );

        // Keep previously derived rate/option fields if content remap drops any.
        return {
          ...next,
          totalRate: next.totalRate || h.totalRate,
          publishedRate: next.publishedRate || h.publishedRate,
          baseRate: next.baseRate || h.baseRate,
          taxes: next.taxes || h.taxes,
          fees: next.fees || h.fees,
          discounts: next.discounts || h.discounts,
          freeBreakfast: next.freeBreakfast ?? h.freeBreakfast,
          freeCancellation: next.freeCancellation ?? h.freeCancellation,
          refundable: next.refundable ?? h.refundable,
          payAtHotel: next.payAtHotel ?? h.payAtHotel,
          boardBasisLabel: next.boardBasisLabel ?? h.boardBasisLabel,
          offerLabel: next.offerLabel ?? h.offerLabel,
          amenityPills:
            next.amenityPills.length > 0 ? next.amenityPills : h.amenityPills,
          highlightAttributes:
            next.highlightAttributes.length > 0
              ? next.highlightAttributes
              : h.highlightAttributes,
        };
      });

      if (get().abortController === abortController) {
        set({
          contentById: hydrated,
          hotels: remapped,
          status: "completed",
          abortController: null,
        });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (get().abortController === abortController) {
          set({ status: "idle", abortController: null });
        }
        return;
      }
      if (get().abortController !== abortController) return;

      const isRateLimited =
        err instanceof ZentrumApiError && err.status === 429;
      const message = isRateLimited
        ? "Rate limit exceeded. Please wait about 60 seconds, then try again."
        : err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Search failed";

      set({
        status: "error",
        error: message,
        retryAfterSeconds: isRateLimited ? 60 : null,
        abortController: null,
      });
    }
  },

  repriceHotel: async (hotelId, currency, options) => {
    if (!isZentrumConfigured()) {
      set({
        status: "error",
        error:
          "ZentrumHub credentials missing. Add API key, account ID, and channel ID to .env.local",
        retryAfterSeconds: null,
      });
      return;
    }

    const state = get();
    const checkIn = options?.checkIn || state.criteria?.checkIn;
    const checkOut = options?.checkOut || state.criteria?.checkOut;
    const occupancies =
      options?.occupancies || state.criteria?.occupancies || [{ numOfAdults: 2 }];

    if (!hotelId || !checkIn || !checkOut) {
      set({
        status: "error",
        error: "Missing dates to refresh prices for this hotel.",
        retryAfterSeconds: null,
      });
      return;
    }

    // Already priced in this currency with an active token — keep session.
    if (
      state.token &&
      state.currency === currency &&
      state.status === "completed" &&
      state.hotels.some((h) => h.id === hotelId && h.currency === currency)
    ) {
      return;
    }

    state.abortController?.abort();
    const abortController = new AbortController();
    const correlationId = createCorrelationId();

    const nextCriteria: SearchCriteria = {
      destination: state.criteria?.destination ?? {
        id: hotelId,
        label: hotelId,
        city: "",
        country: "",
        type: "Hotel",
        referenceId: hotelId,
      },
      checkIn,
      checkOut,
      occupancies,
      currency,
      nationality: state.criteria?.nationality,
      countryOfResidence: state.criteria?.countryOfResidence,
    };

    // Hotel-scoped key so returning to /search always re-runs destination search.
    const key = `reprice:${hotelId}:${searchCriteriaKey(nextCriteria)}`;

    // Keep the previous token until init returns so hotel-detail UI stays in ZH mode.
    set({
      criteria: nextCriteria,
      criteriaKey: key,
      status: "init",
      correlationId,
      error: null,
      retryAfterSeconds: null,
      abortController,
      expectedHotelCount: 1,
      completedHotelCount: 0,
      currency,
    });

    try {
      if (abortController.signal.aborted) return;

      const { data: init } = await searchInit(
        {
          checkIn,
          checkOut,
          occupancies,
          currency,
          hotelIds: [hotelId],
          nationality: nextCriteria.nationality,
          countryOfResidence: nextCriteria.countryOfResidence,
        },
        { correlationId }
      );
      if (abortController.signal.aborted) return;

      const token = init.token;
      if (!token) throw new Error("Search init did not return a token");

      set({ token, status: "polling" });

      await pollUntilComplete(token, {
        correlationId,
        signal: abortController.signal,
        onBatch: async (batch, hotelsById) => {
          const contentById = { ...get().contentById };
          if (!contentHasName(contentById[hotelId])) {
            try {
              const { data } = await getHotelContent([hotelId], { correlationId });
              for (const hotel of data.hotels ?? []) {
                const id = hotel.id != null ? String(hotel.id) : null;
                if (id) contentById[id] = hotel;
              }
            } catch {
              /* content is best-effort */
            }
          }

          const batchCurrency = batch.currency ?? currency;
          const existingById = new Map(get().hotels.map((h) => [h.id, h]));
          for (const hotel of hotelsById.values()) {
            if (!hotel.id) continue;
            existingById.set(
              String(hotel.id),
              mapContent(hotel, contentById[String(hotel.id)], batchCurrency)
            );
          }

          set({
            contentById,
            hotels: Array.from(existingById.values()),
            currency: batchCurrency,
            expectedHotelCount: batch.expectedHotelCount ?? 1,
            completedHotelCount: batch.completedHotelCount ?? get().completedHotelCount,
          });
        },
      });

      if (abortController.signal.aborted) return;

      if (get().abortController === abortController) {
        set({
          status: "completed",
          abortController: null,
        });
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        if (get().abortController === abortController) {
          set({ status: "idle", abortController: null });
        }
        return;
      }
      if (get().abortController !== abortController) return;

      const isRateLimited = err instanceof ZentrumApiError && err.status === 429;
      const message = isRateLimited
        ? "Rate limit exceeded. Please wait about 60 seconds, then try again."
        : err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to refresh prices";

      set({
        status: "error",
        error: message,
        retryAfterSeconds: isRateLimited ? 60 : null,
        abortController: null,
      });
    }
  },

  reset: () => {
    get().abortController?.abort();
    set({
      criteria: null,
      criteriaKey: null,
      token: null,
      correlationId: null,
      status: "idle",
      hotels: [],
      contentById: {},
      expectedHotelCount: 0,
      completedHotelCount: 0,
      currency: zentrumConfig.defaultCurrency,
      error: null,
      retryAfterSeconds: null,
      abortController: null,
    });
  },
}));
