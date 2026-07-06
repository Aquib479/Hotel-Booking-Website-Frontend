import { useEffect, useState } from "react";
import { fetchBookingById } from "../api";
import type { BookingDetail } from "../types";

export function useBookingDetail(id: string | undefined) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<"not_found" | "unauthorized" | "network" | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setError("not_found");
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchBookingById(id)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setBooking(null);
          setError("not_found");
        } else {
          setBooking(result);
          setError(null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("network");
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { booking, isLoading, error };
}
