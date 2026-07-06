import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  BOOKINGS_LANE_PARAM,
  BOOKINGS_PAGE_PARAM,
  BOOKINGS_SEARCH_PARAM,
  BOOKINGS_STATUS_PARAM,
  DEFAULT_BOOKING_STATUS,
} from "../constants";
import type { BookingFilters, BookingTabStatus, LaneFilter } from "../types";

function parseStatus(value: string | null): BookingTabStatus {
  if (value === "past" || value === "cancelled" || value === "upcoming") return value;
  return DEFAULT_BOOKING_STATUS;
}

function parseLane(value: string | null): LaneFilter {
  if (value === "direct" || value === "wholesale") return value;
  return "all";
}

export function useBookingFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: BookingFilters = useMemo(
    () => ({
      status: parseStatus(searchParams.get(BOOKINGS_STATUS_PARAM)),
      lane: parseLane(searchParams.get(BOOKINGS_LANE_PARAM)),
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
          if (patch.lane !== undefined) {
            if (patch.lane === "all") next.delete(BOOKINGS_LANE_PARAM);
            else next.set(BOOKINGS_LANE_PARAM, patch.lane);
          }
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

  const setLane = useCallback(
    (lane: LaneFilter) => setFilters({ lane, page: 1 }),
    [setFilters]
  );

  const setSearch = useCallback(
    (search: string) => setFilters({ search, page: 1 }),
    [setFilters]
  );

  const setPage = useCallback((page: number) => setFilters({ page }), [setFilters]);

  return { filters, setStatus, setLane, setSearch, setPage, setFilters };
}
