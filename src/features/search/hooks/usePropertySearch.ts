import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { differenceInDays, format, parseISO } from "date-fns";
import type { AmenityFilter, RestSlot } from "@/lib/booking/types";
import { supportsRestMode, supportsStayMode } from "@/lib/booking/availability";
import { convertFromIdr, getWholesaleGuestPriceUsdRounded } from "@/lib/currency/format";
import { api } from "@/services/api";
import {
  DEFAULT_PER_PAGE,
  DEFAULT_PRICE_MAX,
  DEFAULT_PRICE_MIN,
} from "../constants";
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
    latitude: h.latitude ?? null,
    longitude: h.longitude ?? null,
    distanceFromAirportKm: 0,
    slotDuration: slotType === "FULL_DAY" ? "24h" : "12h",
    timezone: "Asia/Jakarta",
    createdAt: new Date().toISOString(),
  };
}

function frontendSlotToBackend(slot: RestSlot): "HALF_DAY" | "FULL_DAY" {
  return slot === "24h" ? "FULL_DAY" : "HALF_DAY";
}

function parseGuestCount(guestsLabel: string): number {
  const match = guestsLabel.match(/(\d+)/);
  return match ? Number(match[1]) : 2;
}

function parseDate(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
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
    property.address.toLowerCase().includes(query)
  );
}

function getPropertyPriceUsd(property: Property): number {
  if (property.lane === "wholesale" && property.wholesalePricing) {
    return getWholesaleGuestPriceUsdRounded(property.wholesalePricing);
  }
  if (property.lane === "wholesale") return property.priceUsd;
  return property.priceUsd || convertFromIdr(property.priceIdr, "USD");
}

function getDefaultFilters(): FilterState {
  return {
    priceMin: DEFAULT_PRICE_MIN,
    priceMax: DEFAULT_PRICE_MAX,
    lane: "all",
    starRating: "any",
    roomType: "any",
    maxOccupancy: "any",
    amenities: [],
    slotDuration: "any",
    maxAirportDistance: "any",
    category: "all",
  };
}

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.priceMin !== DEFAULT_PRICE_MIN || filters.priceMax !== DEFAULT_PRICE_MAX) count++;
  if (filters.lane !== "all") count++;
  if (filters.starRating !== "any") count++;
  if (filters.roomType !== "any") count++;
  if (filters.maxOccupancy !== "any") count++;
  if (filters.amenities.length > 0) count++;
  if (filters.slotDuration !== "any") count++;
  if (filters.maxAirportDistance !== "any") count++;
  if (filters.category !== "all" && filters.category !== "resthalf-exclusive") count++;
  return count;
}

export function usePropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: SearchQuery = useMemo(
    () => ({
      location: searchParams.get("location") ?? "Bangalore",
      mode: (searchParams.get("mode") as SearchQuery["mode"]) ?? "stay",
      checkIn: parseDate(searchParams.get("checkIn")),
      checkOut: parseDate(searchParams.get("checkOut")),
      restDate: parseDate(searchParams.get("restDate")),
      slot: (searchParams.get("slot") as RestSlot) ?? "12-24",
      guests: searchParams.get("guests") ?? "2 adults",
    }),
    [searchParams]
  );

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...getDefaultFilters(),
    category: searchParams.get("category") ?? "all",
  }));

  const sort = (searchParams.get("sort") as SortOption) ?? "latest";
  const view = (searchParams.get("view") as ViewMode) ?? "card";
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? String(DEFAULT_PER_PAGE));

  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [apiProperties, setApiProperties] = useState<Property[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const dateStr =
      query.mode === "rest" && query.restDate
        ? format(query.restDate, "yyyy-MM-dd")
        : query.checkIn
          ? format(query.checkIn, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd");

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

    setIsLoading(true);

    api
      .get<SearchApiResponse>(`/search?${params.toString()}`)
      .then((res) => {
        if (cancelled) return;
        const mapped = res.results.map((r) => mapApiResultToProperty(r, res.slotType));
        setApiProperties(mapped);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setApiProperties(null);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query.location, query.mode, query.restDate, query.checkIn, query.slot, query.guests]);

  const nights = useMemo(() => {
    if (query.mode === "rest") return 1;
    if (query.checkIn && query.checkOut) {
      return Math.max(1, differenceInDays(query.checkOut, query.checkIn));
    }
    return 1;
  }, [query.checkIn, query.checkOut, query.mode]);

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
      const updates: Record<string, string | null> = {
        location: next.location ?? query.location,
        guests: next.guests ?? query.guests,
        mode,
        page: "1",
      };

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
        updates.slot = next.slot ?? query.slot ?? "12-24";
        updates.checkIn = null;
        updates.checkOut = null;
      }

      updateParams(updates);
    },
    [query, updateParams]
  );

  const sourceProperties = apiProperties ?? [];

  const filteredProperties = useMemo(() => {
    let results = sourceProperties.filter((property) => {
      if (!matchesLocation(property, query.location)) return false;

      const price = getPropertyPriceUsd(property);
      if (price < filters.priceMin || price > filters.priceMax) return false;

      if (filters.lane !== "all" && property.lane !== filters.lane) return false;
      if (filters.category === "resthalf-exclusive" && property.lane !== "direct") return false;
      if (
        filters.category !== "all" &&
        filters.category !== "resthalf-exclusive" &&
        property.category !== filters.category
      ) {
        return false;
      }

      if (!matchesCountFilter(property.starRating, filters.starRating)) return false;
      if (filters.roomType !== "any" && property.roomType !== filters.roomType) return false;
      if (!matchesCountFilter(property.maxOccupancy, filters.maxOccupancy)) return false;

      if (
        filters.amenities.length > 0 &&
        !filters.amenities.every((a) => property.amenities.includes(a))
      ) {
        return false;
      }

      if (filters.slotDuration !== "any" && property.slotDuration !== filters.slotDuration) {
        return false;
      }

      if (
        filters.maxAirportDistance !== "any" &&
        property.distanceFromAirportKm > Number(filters.maxAirportDistance)
      ) {
        return false;
      }

      if (query.mode === "rest" && !supportsRestMode(property)) return false;
      if (query.mode === "stay" && !supportsStayMode(property)) return false;

      return true;
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return getPropertyPriceUsd(a) - getPropertyPriceUsd(b);
        case "price-desc":
          return getPropertyPriceUsd(b) - getPropertyPriceUsd(a);
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
  }, [filters, query.location, query.mode, sort, sourceProperties]);

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

  const activeFilterCount = countActiveFilters(filters);

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
    setFilters(getDefaultFilters());
    updateParams({ category: null, page: "1" });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
    favorites,
    isLoading,
    isUsingMockData: apiProperties === null,
    setQuery,
    setSort,
    setView,
    setPage,
    setPerPage,
    setCategory,
    updateFilters,
    clearFilters,
    toggleFavorite,
    toggleAmenity,
  };
}
