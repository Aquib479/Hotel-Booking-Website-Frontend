import { useEffect, useState } from "react";
import { fetchBookings } from "../api";
import type { BookingFilters, BookingsListState } from "../types";

const INITIAL: BookingsListState = {
  bookings: [],
  total: 0,
  counts: { upcoming: 0, past: 0, cancelled: 0 },
  isLoading: true,
  error: null,
};

export function useBookingsList(filters: BookingFilters) {
  const [state, setState] = useState<BookingsListState>(INITIAL);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));

    fetchBookings(filters)
      .then((result) => {
        if (!cancelled) {
          setState({
            bookings: result.bookings,
            total: result.total,
            counts: result.counts,
            isLoading: false,
            error: null,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState((s) => ({
            ...s,
            isLoading: false,
            error: "Couldn't load your bookings. Please try again.",
          }));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters.status, filters.lane, filters.search, filters.page]);

  return state;
}
