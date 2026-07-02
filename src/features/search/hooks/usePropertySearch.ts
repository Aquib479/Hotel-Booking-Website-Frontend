import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { differenceInDays, parseISO } from "date-fns";
import {
  DEFAULT_PER_PAGE,
  DEFAULT_PRICE_MAX,
  DEFAULT_PRICE_MIN,
  MOCK_PROPERTIES,
} from "../constants";
import type {
  CountFilter,
  FilterState,
  PlaceType,
  Property,
  PropertyType,
  SearchQuery,
  SortOption,
  ViewMode,
} from "../types";

const DEFAULT_PLACE_TYPES: PlaceType[] = ["entire", "room"];

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
    `${property.city}, ${property.country}`.toLowerCase().includes(query) ||
    property.address.toLowerCase().includes(query)
  );
}

function getDefaultFilters(): FilterState {
  return {
    priceMin: DEFAULT_PRICE_MIN,
    priceMax: DEFAULT_PRICE_MAX,
    placeTypes: [...DEFAULT_PLACE_TYPES],
    bedrooms: "any",
    beds: "any",
    bathrooms: "any",
    propertyType: "any",
    category: "all",
  };
}

function countActiveFilters(filters: FilterState): number {
  let count = 0;
  if (filters.priceMin !== DEFAULT_PRICE_MIN || filters.priceMax !== DEFAULT_PRICE_MAX) count++;
  if (
    filters.placeTypes.length !== DEFAULT_PLACE_TYPES.length ||
    !DEFAULT_PLACE_TYPES.every((t) => filters.placeTypes.includes(t))
  ) {
    count++;
  }
  if (filters.bedrooms !== "any") count++;
  if (filters.beds !== "any") count++;
  if (filters.bathrooms !== "any") count++;
  if (filters.propertyType !== "any") count++;
  if (filters.category !== "all") count++;
  return count;
}

export function usePropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: SearchQuery = useMemo(
    () => ({
      location: searchParams.get("location") ?? "Toronto, Canada",
      checkIn: parseDate(searchParams.get("checkIn")),
      checkOut: parseDate(searchParams.get("checkOut")),
      guests: searchParams.get("guests") ?? "4 adults",
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

  const nights = useMemo(() => {
    if (query.checkIn && query.checkOut) {
      return Math.max(1, differenceInDays(query.checkOut, query.checkIn));
    }
    return 20;
  }, [query.checkIn, query.checkOut]);

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
      updateParams({
        location: next.location ?? query.location,
        checkIn: next.checkIn?.toISOString() ?? (query.checkIn ? query.checkIn.toISOString() : null),
        checkOut: next.checkOut?.toISOString() ?? (query.checkOut ? query.checkOut.toISOString() : null),
        guests: next.guests ?? query.guests,
        page: "1",
      });
    },
    [query, updateParams]
  );

  const filteredProperties = useMemo(() => {
    let results = MOCK_PROPERTIES.filter((property) => {
      if (!matchesLocation(property, query.location)) return false;
      if (property.pricePerNight < filters.priceMin || property.pricePerNight > filters.priceMax) {
        return false;
      }
      if (!filters.placeTypes.includes(property.placeType)) return false;
      if (!matchesCountFilter(property.bedrooms, filters.bedrooms)) return false;
      if (!matchesCountFilter(property.beds, filters.beds)) return false;
      if (!matchesCountFilter(property.bathrooms, filters.bathrooms)) return false;
      if (filters.propertyType !== "any" && property.propertyType !== filters.propertyType) {
        return false;
      }
      if (filters.category !== "all" && property.category !== filters.category) return false;
      return true;
    });

    results = [...results].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.pricePerNight - b.pricePerNight;
        case "price-desc":
          return b.pricePerNight - a.pricePerNight;
        case "rating":
          return b.rating - a.rating;
        default:
          return b.createdAt.localeCompare(a.createdAt);
      }
    });

    return results;
  }, [filters, query.location, sort]);

  const totalResults = filteredProperties.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / perPage));
  const currentPage = Math.min(page, totalPages);

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredProperties.slice(start, start + perPage);
  }, [currentPage, filteredProperties, perPage]);

  const categoryCounts = useMemo(() => {
    const base = MOCK_PROPERTIES.filter((p) => matchesLocation(p, query.location));
    const counts: Record<string, number> = { all: base.length };
    base.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, [query.location]);

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

  const togglePlaceType = (type: PlaceType) => {
    setFilters((prev) => {
      const exists = prev.placeTypes.includes(type);
      const placeTypes = exists
        ? prev.placeTypes.filter((t) => t !== type)
        : [...prev.placeTypes, type];
      return { ...prev, placeTypes: placeTypes.length ? placeTypes : [type] };
    });
    updateParams({ page: "1" });
  };

  const setPropertyType = (type: PropertyType | "any") => {
    updateFilters({ propertyType: type });
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
    categoryCounts,
    activeFilterCount,
    favorites,
    setQuery,
    setSort,
    setView,
    setPage,
    setPerPage,
    setCategory,
    updateFilters,
    clearFilters,
    toggleFavorite,
    togglePlaceType,
    setPropertyType,
  };
}
