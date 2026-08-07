import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { differenceInDays, format, parseISO } from "date-fns";
import type { AmenityFilter, RestSlot } from "@/lib/booking/types";
import { AMENITY_FILTER_OPTIONS } from "@/lib/booking/types";
import { supportsRestMode, supportsStayMode } from "@/lib/booking/availability";
import { convertToUsd } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import { defaultPriceMaxForCurrency, getDisplayAmount } from "@/lib/currency/pricing";
import { useCurrency } from "@/context/CurrencyContext";
import { api } from "@/services/api";
import { isZentrumConfigured, type LocationType, type Occupancy } from "@/services/zentrumhub";
import {
  formatDateForApi,
  useSearchStore,
  type SearchDestination,
} from "@/store";
import {
  DEFAULT_PER_PAGE,
  DEFAULT_PRICE_MIN,
} from "../constants";
import { resolvePropertyCoordinates } from "../map-coordinates";
import type {
  CountFilter,
  FilterState,
  Property,
  SearchQuery,
  SortOption,
  ViewMode,
} from "../types";

interface SearchApiHotel {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  source: string;
  imageUrl: string | null;
  imageUrls: string[];
}

interface SearchApiResult {
  hotel: SearchApiHotel;
  availableRooms: number;
  startingPrice: number;
  currency: string;
  roomTypes: string[];
  maxOccupancy: number;
}

interface SearchApiResponse {
  date: string;
  slotType: string;
  startTime: string;
  endTime: string;
  results: SearchApiResult[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

function mapApiResultToProperty(result: SearchApiResult, slotType: string): Property {
  const h = result.hotel;
  const roomType = result.roomTypes[0] ?? "double";
  const coords = resolvePropertyCoordinates({
    id: h.id,
    city: h.city ?? "",
    latitude: h.latitude ?? null,
    longitude: h.longitude ?? null,
  });

  return {
    id: h.id,
    title: h.name,
    address: h.address ?? "",
    city: h.city ?? "",
    country: h.country ?? "",
    image: h.imageUrl ?? FALLBACK_IMAGE,
    rating: h.rating ?? 4.0,
    starRating: Math.round(h.rating ?? 4),
    lane: "direct",
    priceUsd: 0,
    priceIdr: result.startingPrice,
    roomType: roomType as Property["roomType"],
    maxOccupancy: result.maxOccupancy,
    amenities: [],
    category: "all",
    latitude: coords?.lat ?? null,
    longitude: coords?.lng ?? null,
    distanceFromAirportKm: 0,
    slotDuration: slotType === "FULL_DAY" ? "24h" : "12h",
    timezone: "Asia/Jakarta",
    createdAt: new Date().toISOString(),
  };
}

function mapZentrumHotelToProperty(
  hotel: {
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
    amenities: string[];
    freeBreakfast?: boolean;
    freeCancellation?: boolean;
    refundable?: boolean;
  },
  nights: number
): Property {
  const safeNights = Math.max(1, nights);
  const perNightInApiCurrency = hotel.totalRate > 0 ? hotel.totalRate / safeNights : 0;
  const apiCurrency = (hotel.currency || "USD").toUpperCase() as CurrencyCode;
  // Keep a USD estimate only for legacy helpers; display uses priceAmount + priceCurrency.
  const priceUsd =
    perNightInApiCurrency <= 0
      ? 0
      : CURRENCIES.some((c) => c.code === apiCurrency)
        ? convertToUsd(perNightInApiCurrency, apiCurrency)
        : perNightInApiCurrency;

  const amenitySet = new Set(hotel.amenities.map((a) => a.toLowerCase()));
  if (hotel.freeBreakfast) amenitySet.add("breakfast");
  if (hotel.freeCancellation || hotel.refundable) amenitySet.add("free cancellation");

  const mappedAmenities = AMENITY_FILTER_OPTIONS.filter((opt) => {
    const needle = opt.toLowerCase();
    if (amenitySet.has(needle)) return true;
    return [...amenitySet].some(
      (a) => a.includes(needle) || needle.includes(a) || fuzzyAmenityMatch(a, needle)
    );
  }) as AmenityFilter[];

  const roomType = inferRoomTypeFromAmenities(hotel.name, mappedAmenities);

  return {
    id: hotel.id,
    title: hotel.name,
    address: hotel.address,
    city: hotel.city,
    country: hotel.country,
    image: hotel.image || FALLBACK_IMAGE,
    rating: hotel.rating || hotel.starRating || 0,
    // Keep official stars only; do not derive from guest review score
    starRating:
      hotel.starRating > 0 && hotel.starRating <= 5
        ? Math.round(hotel.starRating)
        : 0,
    lane: "wholesale",
    priceAmount: perNightInApiCurrency,
    priceCurrency: apiCurrency,
    priceUsd,
    priceIdr: 0,
    roomType,
    maxOccupancy: 2,
    amenities: mappedAmenities,
    category: "all",
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    distanceFromAirportKm: 0,
    slotDuration: "24h",
    timezone: "UTC",
    supplierName: "ZentrumHub",
    createdAt: new Date().toISOString(),
  };
}

function fuzzyAmenityMatch(actual: string, filter: string): boolean {
  const pairs: Record<string, string[]> = {
    wifi: ["wi-fi", "wireless", "internet"],
    "air conditioning": ["ac", "a/c", "air-conditioning", "aircon"],
    "free parking": ["parking"],
    pool: ["swimming"],
    gym: ["fitness"],
    breakfast: ["breakfast"],
    "airport shuttle": ["shuttle", "airport"],
    kitchen: ["kitchenette", "kitchen"],
  };
  const aliases = pairs[filter] ?? [];
  return aliases.some((a) => actual.includes(a));
}

function inferRoomTypeFromAmenities(
  name: string,
  _amenities: AmenityFilter[]
): Property["roomType"] {
  const n = name.toLowerCase();
  if (n.includes("suite")) return "suite";
  if (n.includes("family")) return "family";
  if (n.includes("single") || n.includes("twin")) return "single";
  return "double";
}

function frontendSlotToBackend(slot: RestSlot): "HALF_DAY" | "FULL_DAY" {
  return slot === "24h" ? "FULL_DAY" : "HALF_DAY";
}

function parseGuestCount(guestsLabel: string): number {
  const match = guestsLabel.match(/(\d+)/);
  return match ? Number(match[1]) : 2;
}

/** Parse labels like "2 Adults, 1 Child · 2 Rooms" into ZentrumHub occupancies. */
export function parseOccupancies(guestsLabel: string, roomsParam?: number): Occupancy[] {
  const adultsMatch = guestsLabel.match(/(\d+)\s*adult/i);
  const kidsMatch =
    guestsLabel.match(/(\d+)\s*child/i) || guestsLabel.match(/(\d+)\s*kid/i);
  const roomsMatch = guestsLabel.match(/(\d+)\s*room/i);
  const numOfAdults = adultsMatch ? Number(adultsMatch[1]) : parseGuestCount(guestsLabel);
  const kidCount = kidsMatch ? Number(kidsMatch[1]) : 0;
  const rooms = Math.max(1, roomsParam ?? (roomsMatch ? Number(roomsMatch[1]) : 1));
  const adultsPerRoom = Math.max(1, Math.ceil(Math.max(1, numOfAdults) / rooms));
  const kidsPerRoom = Math.floor(kidCount / rooms);
  const leftoverKids = kidCount % rooms;

  return Array.from({ length: rooms }, (_, index) => {
    const roomKids = kidsPerRoom + (index < leftoverKids ? 1 : 0);
    return {
      numOfAdults: adultsPerRoom,
      childAges: roomKids > 0 ? Array.from({ length: roomKids }, () => 8) : undefined,
    };
  });
}

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function parseNumber(value: string | null): number | undefined {
  if (value == null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function matchesCountFilter(value: number, filter: CountFilter): boolean {
  if (filter === "any") return true;
  if (filter === 5) return value >= 5;
  return value === filter;
}

function matchesLocation(property: Property, location: string): boolean {
  const query = location.toLowerCase();
  if (!query) return true;
  return (
    property.city.toLowerCase().includes(query) ||
    property.country.toLowerCase().includes(query) ||
    property.address.toLowerCase().includes(query) ||
    property.title.toLowerCase().includes(query)
  );
}

function getPropertyFilterPrice(property: Property, displayCurrency: CurrencyCode): number {
  return getDisplayAmount(
    property.lane,
    property.priceUsd,
    property.priceIdr,
    displayCurrency,
    property.wholesalePricing,
    property.priceAmount,
    property.priceCurrency
  );
}

function getDefaultFilters(displayCurrency: CurrencyCode = "USD"): FilterState {
  return {
    priceMin: DEFAULT_PRICE_MIN,
    priceMax: defaultPriceMaxForCurrency(displayCurrency),
    lane: "all",
    starRatings: [],
    guestRatingMin: "any",
    roomType: "any",
    maxOccupancy: "any",
    amenities: [],
    slotDuration: "any",
    maxAirportDistance: "any",
    category: "all",
  };
}

function countActiveFilters(filters: FilterState, displayCurrency: CurrencyCode): number {
  let count = 0;
  const defaultMax = defaultPriceMaxForCurrency(displayCurrency);
  if (filters.priceMin !== DEFAULT_PRICE_MIN || filters.priceMax !== defaultMax) count++;
  if (filters.lane !== "all") count++;
  if (filters.starRatings.length > 0) count++;
  if (filters.guestRatingMin !== "any") count++;
  if (filters.roomType !== "any") count++;
  if (filters.maxOccupancy !== "any") count++;
  if (filters.amenities.length > 0) count++;
  if (filters.slotDuration !== "any") count++;
  if (filters.maxAirportDistance !== "any") count++;
  return count;
}

function destinationFromQuery(query: SearchQuery): SearchDestination {
  return {
    id: query.locationId || query.location,
    label: query.location,
    city: query.location,
    state: query.state,
    country: query.country || "",
    type: query.locationType as LocationType | undefined,
    referenceId: query.referenceId,
    coordinates:
      query.lat != null && query.lng != null
        ? { lat: query.lat, long: query.lng }
        : undefined,
  };
}

export function usePropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency } = useCurrency();
  const zhHotels = useSearchStore((s) => s.hotels);
  const zhStatus = useSearchStore((s) => s.status);
  const zhError = useSearchStore((s) => s.error);
  const runSearch = useSearchStore((s) => s.runSearch);

  const query: SearchQuery = useMemo(
    () => ({
      location: searchParams.get("location") ?? "",
      mode: (searchParams.get("mode") as SearchQuery["mode"]) ?? "stay",
      checkIn: parseDate(searchParams.get("checkIn")),
      checkOut: parseDate(searchParams.get("checkOut")),
      restDate: parseDate(searchParams.get("restDate")),
      slot: (searchParams.get("slot") as RestSlot) ?? undefined,
      guests: searchParams.get("guests") ?? "",
      rooms: parseNumber(searchParams.get("rooms")),
      adults: parseNumber(searchParams.get("adults")),
      children: parseNumber(searchParams.get("children")),
      locationId: searchParams.get("locationId") ?? undefined,
      locationType: searchParams.get("locationType") ?? undefined,
      referenceId: searchParams.get("referenceId") ?? undefined,
      lat: parseNumber(searchParams.get("lat")),
      lng: parseNumber(searchParams.get("lng")),
      country: searchParams.get("country") ?? undefined,
      state: searchParams.get("state") ?? undefined,
    }),
    [searchParams]
  );

  const hasSearchCriteria = Boolean(
    query.location.trim() &&
      query.guests.trim() &&
      (query.mode === "stay"
        ? query.checkIn && query.checkOut
        : query.restDate)
  );

  const useZentrum = query.mode === "stay" && isZentrumConfigured();

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilters(currency),
    category: searchParams.get("category") ?? "all",
  }));

  // When guest currency changes, reset budget bounds to that currency's scale.
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceMin: DEFAULT_PRICE_MIN,
      priceMax: defaultPriceMaxForCurrency(currency),
    }));
  }, [currency]);

  const sort = (searchParams.get("sort") as SortOption) ?? "latest";
  const view = (searchParams.get("view") as ViewMode) ?? "card";
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? String(DEFAULT_PER_PAGE));

  const [apiProperties, setApiProperties] = useState<Property[]>([]);
  const [isLoadingLegacy, setIsLoadingLegacy] = useState(false);
  const [errorLegacy, setErrorLegacy] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const resetSearch = useSearchStore((s) => s.reset);

  useEffect(() => {
    if (!useZentrum) return;

    if (!hasSearchCriteria || !query.checkIn || !query.checkOut) {
      resetSearch();
      return;
    }

    const criteria = {
      destination: destinationFromQuery(query),
      checkIn: formatDateForApi(query.checkIn),
      checkOut: formatDateForApi(query.checkOut),
      occupancies: parseOccupancies(query.guests, query.rooms),
      // Live supplier rates in the guest's selected currency (no client-side FX for ZH).
      currency,
      countryOfResidence: undefined,
    };

    // Debounce collapses React StrictMode double-mount + rapid URL updates
    // into a single Search Init (avoids ZentrumHub 429s).
    const timer = window.setTimeout(() => {
      void runSearch(criteria);
    }, 450);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    useZentrum,
    hasSearchCriteria,
    query.location,
    query.locationId,
    query.locationType,
    query.referenceId,
    query.lat,
    query.lng,
    query.checkIn?.toISOString(),
    query.checkOut?.toISOString(),
    query.guests,
    query.rooms,
    query.country,
    query.state,
    currency,
    reloadKey,
    runSearch,
    resetSearch,
  ]);

  useEffect(() => {
    if (useZentrum) return;

    if (!hasSearchCriteria) {
      setApiProperties([]);
      setIsLoadingLegacy(false);
      setErrorLegacy(null);
      return;
    }

    let cancelled = false;

    const dateStr =
      query.mode === "rest" && query.restDate
        ? format(query.restDate, "yyyy-MM-dd")
        : query.checkIn
          ? format(query.checkIn, "yyyy-MM-dd")
          : null;

    if (!dateStr) {
      setApiProperties([]);
      setIsLoadingLegacy(false);
      return;
    }

    const slotType =
      query.mode === "rest"
        ? frontendSlotToBackend(query.slot ?? "12-24")
        : "FULL_DAY";

    const guests = parseGuestCount(query.guests);

    const params = new URLSearchParams();
    params.set("date", dateStr);
    params.set("slotType", slotType);
    params.set("guests", String(guests));
    if (query.location.trim()) {
      params.set("q", query.location.trim());
    }

    setIsLoadingLegacy(true);
    setErrorLegacy(null);

    api
      .get<SearchApiResponse>(`/search?${params.toString()}`)
      .then((res) => {
        if (cancelled) return;
        const mapped = res.results.map((r) => mapApiResultToProperty(r, res.slotType));
        setApiProperties(mapped);
        setIsLoadingLegacy(false);
      })
      .catch(() => {
        if (cancelled) return;
        setApiProperties([]);
        setErrorLegacy("Failed to load hotels. Please try again.");
        setIsLoadingLegacy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    useZentrum,
    hasSearchCriteria,
    query.location,
    query.mode,
    query.restDate,
    query.checkIn,
    query.slot,
    query.guests,
    reloadKey,
  ]);

  const nights = useMemo(() => {
    if (query.mode === "rest") return 1;
    if (query.checkIn && query.checkOut) {
      return Math.max(1, differenceInDays(query.checkOut, query.checkIn));
    }
    return 1;
  }, [query.checkIn, query.checkOut, query.mode]);

  const sourceProperties = useMemo(() => {
    if (useZentrum) return zhHotels.map((h) => mapZentrumHotelToProperty(h, nights));
    return apiProperties;
  }, [useZentrum, zhHotels, apiProperties, nights]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value === null || value === "") next.delete(key);
          else next.set(key, value);
        });
        return next;
      });
    },
    [setSearchParams]
  );

  const setQuery = useCallback(
    (next: Partial<SearchQuery>) => {
      const mode = next.mode ?? query.mode;
      const nextLocation = next.location !== undefined ? next.location : query.location;
      const nextGuests = next.guests !== undefined ? next.guests : query.guests;
      const updates: Record<string, string | null> = {
        location: nextLocation.trim() ? nextLocation : null,
        guests: nextGuests.trim() ? nextGuests : null,
        rooms:
          next.rooms != null
            ? String(next.rooms)
            : query.rooms != null
              ? String(query.rooms)
              : null,
        adults:
          next.adults != null
            ? String(next.adults)
            : query.adults != null
              ? String(query.adults)
              : null,
        children:
          next.children != null
            ? String(next.children)
            : query.children != null
              ? String(query.children)
              : null,
        mode,
        page: "1",
      };

      const locationChanged =
        next.location !== undefined ||
        next.locationId !== undefined ||
        next.locationType !== undefined ||
        next.referenceId !== undefined ||
        next.lat !== undefined ||
        next.lng !== undefined;

      if (locationChanged) {
        updates.locationId = next.locationId ?? null;
        updates.locationType = next.locationType ?? null;
        updates.referenceId = next.referenceId ?? null;
        updates.lat = next.lat != null ? String(next.lat) : null;
        updates.lng = next.lng != null ? String(next.lng) : null;
        updates.country = next.country ?? null;
        updates.state = next.state ?? null;
      }

      if (mode === "stay") {
        updates.checkIn =
          next.checkIn?.toISOString() ?? (query.checkIn ? query.checkIn.toISOString() : null);
        updates.checkOut =
          next.checkOut?.toISOString() ?? (query.checkOut ? query.checkOut.toISOString() : null);
        updates.restDate = null;
        updates.slot = null;
      } else {
        updates.restDate =
          next.restDate?.toISOString() ?? (query.restDate ? query.restDate.toISOString() : null);
        updates.slot = next.slot ?? query.slot ?? null;
        updates.checkIn = null;
        updates.checkOut = null;
      }

      updateParams(updates);
    },
    [query, updateParams]
  );

  // Show hotels as they stream in; keep spinner only before the first batch.
  const isLoading = !hasSearchCriteria
    ? false
    : useZentrum
      ? (zhStatus === "init" || zhStatus === "polling") && zhHotels.length === 0
      : isLoadingLegacy;

  const error = useZentrum ? zhError : errorLegacy;

  const filteredProperties = useMemo(() => {
    let results = sourceProperties.filter((property) => {
      if (!useZentrum && !matchesLocation(property, query.location)) return false;

      const price = getPropertyFilterPrice(property, currency);
      // Ignore $0 placeholder rates so incomplete content doesn't wipe results
      if (price > 0 && (price < filters.priceMin || price > filters.priceMax)) return false;
      if (
        price === 0 &&
        (filters.priceMin > DEFAULT_PRICE_MIN ||
          filters.priceMax < defaultPriceMaxForCurrency(currency))
      ) {
        return false;
      }

      if (filters.lane !== "all" && property.lane !== filters.lane) return false;

      // Category chips are RestHalf-oriented; don't empty ZH partner inventory.
      if (!useZentrum) {
        if (filters.category === "resthalf-exclusive" && property.lane !== "direct") return false;
        if (
          filters.category !== "all" &&
          filters.category !== "resthalf-exclusive" &&
          property.category !== filters.category
        ) {
          return false;
        }
      }

      // Star filter: multi-select OR of exact star counts
      if (filters.starRatings.length > 0) {
        if (!property.starRating || !filters.starRatings.includes(property.starRating)) {
          return false;
        }
      }

      if (
        filters.guestRatingMin !== "any" &&
        (property.rating <= 0 || property.rating < Number(filters.guestRatingMin))
      ) {
        return false;
      }

      if (filters.roomType !== "any" && property.roomType !== filters.roomType) return false;
      if (!matchesCountFilter(property.maxOccupancy, filters.maxOccupancy)) return false;

      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => property.amenities.includes(a))
      ) {
        return false;
      }

      // Slot duration only applies to RestHalf inventory
      if (!useZentrum) {
        if (filters.slotDuration !== "any" && property.slotDuration !== filters.slotDuration) {
          return false;
        }
      }

      if (
        !useZentrum &&
        filters.maxAirportDistance !== "any" &&
        property.distanceFromAirportKm > Number(filters.maxAirportDistance)
      ) {
        return false;
      }

      if (!useZentrum) {
        if (query.mode === "rest" && !supportsRestMode(property)) return false;
        if (query.mode === "stay" && !supportsStayMode(property)) return false;
      }

      return true;
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return getPropertyFilterPrice(a, currency) - getPropertyFilterPrice(b, currency);
        case "price-desc":
          return getPropertyFilterPrice(b, currency) - getPropertyFilterPrice(a, currency);
        case "rating":
          return b.rating - a.rating;
        case "soonest-slot":
          if (a.lane === "direct" && b.lane !== "direct") return -1;
          if (b.lane === "direct" && a.lane !== "direct") return 1;
          return (a.nextAvailableSlot ?? "").localeCompare(b.nextAvailableSlot ?? "");
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return results;
  }, [currency, filters, query.location, query.mode, sort, sourceProperties, useZentrum]);

  const totalResults = filteredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const currentPage = Math.min(page, totalPages);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredProperties.slice(start, start + perPage);
  }, [currentPage, filteredProperties, perPage]);

  const categoryCounts = useMemo(() => {
    const base = sourceProperties;
    const counts: Record<string, number> = {
      all: base.length,
      "resthalf-exclusive": base.filter((p) => p.lane === "direct").length,
    };
    base.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, [sourceProperties]);

  const activeFilterCount = countActiveFilters(filters, currency);

  const setSort = (value: SortOption) => updateParams({ sort: value, page: "1" });
  const setView = (value: ViewMode) => updateParams({ view: value });
  const setPage = (value: number) => updateParams({ page: String(value) });
  const setPerPage = (value: number) => updateParams({ perPage: String(value), page: "1" });

  const setCategory = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    updateParams({ category: category === "all" ? null : category, page: "1" });
  };

  const updateFilters = (patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    updateParams({ page: "1" });
  };

  const clearFilters = () => {
    setFilters(getDefaultFilters(currency));
    updateParams({ category: null, page: "1" });
  };

  const toggleAmenity = (amenity: AmenityFilter) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      const amenities = exists
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
    updateParams({ page: "1" });
  };

  return {
    query,
    hasSearchCriteria,
    filters,
    sort,
    view,
    page: currentPage,
    perPage,
    totalPages,
    totalResults,
    nights,
    paginatedProperties,
    filteredProperties,
    categoryCounts,
    activeFilterCount,
    isLoading,
    error,
    useZentrum,
    searchStatus: zhStatus,
    reload: () => {
      // Clear dedupe so Try again actually re-hits Search Init.
      useSearchStore.setState({ criteriaKey: null, status: "idle", error: null });
      setReloadKey((key) => key + 1);
    },
    setQuery,
    setSort,
    setView,
    setPage,
    setPerPage,
    setCategory,
    updateFilters,
    clearFilters,
    toggleAmenity,
  };
}
