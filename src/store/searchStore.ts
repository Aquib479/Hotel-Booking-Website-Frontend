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
  rating: number;
  starRating: number;
  latitude: number | null;
  longitude: number | null;
  totalRate: number;
  currency: string;
  freeBreakfast?: boolean;
  freeCancellation?: boolean;
  refundable?: boolean;
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
      links.find((l) => /xl|standard|large|huge/i.test(l.size ?? "")) ??
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

function mapContent(hotel: HotelAvailability, content?: HotelContentItem, currency = "USD"): SearchHotelResult {
  const address = content?.contact?.address;
  const images = extractContentImages(content);
  // Use official hotel star rating only — do not fall back to guest review scores.
  const rawStars = Number(content?.starRating ?? 0);
  const starRating =
    Number.isFinite(rawStars) && rawStars > 0 ? Math.min(5, Math.round(rawStars)) : 0;
  const reviewRating = Number(
    (content?.reviews as { rating?: number } | null | undefined)?.rating ?? 0
  ) || 0;
  const name = content?.name?.trim() || null;

  return {
    id: hotel.id!,
    name: name || `Hotel ${hotel.id}`,
    address: address?.line1 ?? "",
    city: address?.city?.name ?? "",
    country: address?.country?.name ?? "",
    image: images[0] || FALLBACK_IMAGE,
    rating: reviewRating || starRating,
    starRating,
    latitude: content?.geoCode?.lat ?? null,
    longitude: content?.geoCode?.long ?? null,
    totalRate: hotel.rate?.totalRate ?? hotel.rate?.publishedRate ?? hotel.rate?.baseRate ?? 0,
    currency,
    freeBreakfast: hotel.options?.freeBreakfast ?? undefined,
    freeCancellation: hotel.options?.freeCancellation ?? undefined,
    refundable: hotel.options?.refundable ?? undefined,
    amenities: (content?.facilities ?? [])
      .map((f) => f.name)
      .filter((n): n is string => Boolean(n)),
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

      // After rates complete, finish hydrating any hotels still missing names/photos
      const availabilityHotels = get().hotels;
      const allIds = availabilityHotels.map((h) => h.id);
      const hydrated = await fetchContentChunks(allIds, correlationId, get().contentById);
      const remapped = availabilityHotels.map((h) =>
        mapContent(
          {
            id: h.id,
            rate: { totalRate: h.totalRate },
            options: {
              freeBreakfast: h.freeBreakfast,
              freeCancellation: h.freeCancellation,
              refundable: h.refundable,
            },
          },
          hydrated[h.id],
          h.currency
        )
      );

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
