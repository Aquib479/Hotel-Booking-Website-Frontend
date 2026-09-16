import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BOOKINGS_PAGE_PARAM,
  BOOKINGS_SEARCH_PARAM,
  BOOKINGS_STATUS_PARAM,
  DEFAULT_BOOKING_STATUS,
} from "../constants";
import type { BookingFilters, BookingTabStatus } from "../types";

function parseStatus(value: string | null): BookingTabStatus {
  if (value === "past" || value === "cancelled" || value === "upcoming") return value;
  return DEFAULT_BOOKING_STATUS;
}

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: BookingFilters = useMemo(
    () => ({
      status: parseStatus(searchParams.get(BOOKINGS_STATUS_PARAM)),
      search: searchParams.get(BOOKINGS_SEARCH_PARAM) ?? "",
      page: Math.max(1, Number(searchParams.get(BOOKINGS_PAGE_PARAM)) || 1),
    }),
    [searchParams]
  );

  const setFilters = useCallback(
    (patch: Partial<BookingFilters>) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (patch.status !== undefined) next.set(BOOKINGS_STATUS_PARAM, patch.status);
          if (patch.search !== undefined) {
            if (patch.search) next.set(BOOKINGS_SEARCH_PARAM, patch.search);
            else next.delete(BOOKINGS_SEARCH_PARAM);
          }
          if (patch.page !== undefined) {
            if (patch.page <= 1) next.delete(BOOKINGS_PAGE_PARAM);
            else next.set(BOOKINGS_PAGE_PARAM, String(patch.page));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const setStatus = useCallback(
    (status: BookingTabStatus) => setFilters({ status, page: 1 }),
    [setFilters]
  );

  const setSearch = useCallback(
    (search: string) => setFilters({ search, page: 1 }),
    [setFilters]
  );

  const setPage = useCallback((page: number) => setFilters({ page }), [setFilters]);

  return { filters, setStatus, setSearch, setPage, setFilters };
}
