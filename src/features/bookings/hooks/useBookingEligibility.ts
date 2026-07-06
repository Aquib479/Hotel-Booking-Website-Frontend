import { useMemo } from "react";
import {
  getDirectCancelCutoffIso,
  isDirectCancelEligible,
  isSlotInProgress,
} from "@/lib/booking/cancellation";
import { WHOLESALE_CANCEL_API_ENABLED } from "../constants";
import type { BookingDetail, BookingEligibility } from "../types";
import { classifyBookingStatus } from "../utils";

export function useBookingEligibility(
  booking: BookingDetail | null,
  now = new Date()
): BookingEligibility | null {
  return useMemo(() => {
    if (!booking) return null;

    const status = classifyBookingStatus(booking, now);

    if (status === "cancelled" || status === "past") {
      return {
        canCancel: false,
        cancelCutoffPassed: false,
        cancelHandledBy: "none",
        slotInProgress: false,
        showContactSupport: status === "past",
      };
    }

    if (booking.lane === "wholesale") {
      return {
        canCancel: false,
        cancelCutoffPassed: false,
        cancelHandledBy: WHOLESALE_CANCEL_API_ENABLED ? "self-serve" : "support-request",
        slotInProgress: false,
        showContactSupport: true,
      };
    }

    if (booking.mode === "rest" && booking.slotDate && booking.slotWindow) {
      const inProgress = isSlotInProgress(
        booking.slotDate,
        booking.slotWindow,
        booking.hotelTimezone,
        now
      );
      const eligible = isDirectCancelEligible(
        booking.slotDate,
        booking.slotWindow,
        booking.hotelTimezone,
        now
      );
      const cutoffIso = getDirectCancelCutoffIso(
        booking.slotDate,
        booking.slotWindow,
        booking.hotelTimezone
      );

      return {
        canCancel: eligible && !inProgress,
        cancelCutoffPassed: !eligible && !inProgress,
        cancelCutoffTime: cutoffIso,
        cancelHandledBy: eligible ? "self-serve" : "none",
        slotInProgress: inProgress,
        showContactSupport: inProgress || !eligible,
      };
    }

    if (booking.checkIn) {
      const checkInTime = new Date(booking.checkIn).getTime();
      const canCancel = checkInTime > now.getTime();
      return {
        canCancel,
        cancelCutoffPassed: !canCancel,
        cancelHandledBy: canCancel ? "self-serve" : "none",
        slotInProgress: false,
        showContactSupport: !canCancel,
      };
    }

    return {
      canCancel: false,
      cancelCutoffPassed: false,
      cancelHandledBy: "none",
      slotInProgress: false,
      showContactSupport: true,
    };
  }, [booking, now]);
}
