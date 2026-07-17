import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { BookingDetail } from "../types";
import { useBookingDetail } from "./useBookingDetail";

/**
 * Entry mechanism — TBD (depends on Payment page decisions):
 * - Redirect-back: verify booking status server-side; never trust URL params alone.
 * - Webhook + poll: use `confirming_payment` phase until backend status is confirmed.
 *
 * Dev mock: append `?payment=pending` to simulate a brief confirming state.
 */
export type ConfirmationPhase =
  | "loading"
  | "confirming_payment"
  | "confirmed"
  | "redirecting";

export function useBookingConfirmation(id: string | undefined) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentParam = searchParams.get("payment");

  const { booking, isLoading, error } = useBookingDetail(id);
  const [phase, setPhase] = useState<ConfirmationPhase>("loading");

  useEffect(() => {
    if (isLoading) {
      setPhase("loading");
      return;
    }

    if (error || !booking || !id) {
      return;
    }

    if (booking.cancelledAt) {
      setPhase("redirecting");
      navigate(`/bookings/${id}`, { replace: true });
      return;
    }

    if (paymentParam === "pending") {
      setPhase("confirming_payment");
      const timer = window.setTimeout(() => setPhase("confirmed"), 2000);
      return () => window.clearTimeout(timer);
    }

    setPhase("confirmed");
  }, [isLoading, error, booking, id, navigate, paymentParam]);

  return {
    booking: booking as BookingDetail | null,
    isLoading,
    error,
    phase,
  };
}
