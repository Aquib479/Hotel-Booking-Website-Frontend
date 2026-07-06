import { format, parseISO } from "date-fns";
import { formatPrice } from "@/lib/currency/format";
import {
  DIRECT_CANCEL_HOURS_BEFORE_SLOT,
  getMinutesUntilSlotStart,
} from "@/lib/booking/cancellation";
import { formatHotelLocalTime } from "@/lib/booking/timezone";
import type { BookingDetail } from "./types";
import { classifyBookingStatus } from "./utils";

export interface StatusBannerMessage {
  tone: "info" | "success" | "warning" | "muted";
  message: string;
}

function formatSlotStartTime(booking: BookingDetail): string {
  if (!booking.slotDate || !booking.slotWindow) return "";
  const date = parseISO(booking.slotDate);
  const isToday =
    format(date, "yyyy-MM-dd") ===
    new Intl.DateTimeFormat("en-CA", {
      timeZone: booking.hotelTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  const startHour = booking.slotWindow === "12-24" ? 12 : 0;
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: booking.hotelTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0));

  return isToday ? `today at ${label}` : `on ${format(date, "MMM d")} at ${label}`;
}

export function resolveStatusBannerMessage(
  booking: BookingDetail,
  now = new Date()
): StatusBannerMessage {
  const status = classifyBookingStatus(booking, now);

  if (status === "cancelled") {
    if (booking.refund?.status === "pending" || booking.refundStatus === "pending") {
      const amount = booking.refund?.refundAmount ?? booking.paidAmount;
      const cancelledDate = booking.cancelledAt
        ? format(parseISO(booking.cancelledAt), "MMM d, yyyy")
        : "recently";
      return {
        tone: "warning",
        message: `This booking was cancelled on ${cancelledDate}. Refund of ${formatPrice(amount, booking.paidCurrency)} is processing.`,
      };
    }
    if (booking.refund?.status === "refunded" || booking.refundStatus === "refunded") {
      return {
        tone: "muted",
        message: "This booking was cancelled. Your refund has been completed.",
      };
    }
    return {
      tone: "muted",
      message: `This booking was cancelled${booking.cancelReason ? `: ${booking.cancelReason}` : ""}.`,
    };
  }

  if (status === "past") {
    return {
      tone: "success",
      message: "This stay is complete. We hope it was restful.",
    };
  }

  if (booking.lane === "direct" && booking.mode === "rest" && booking.slotDate && booking.slotWindow) {
    const minutes = getMinutesUntilSlotStart(
      booking.slotDate,
      booking.slotWindow,
      booking.hotelTimezone,
      now
    );
    const slotTime = formatSlotStartTime(booking);

    if (minutes <= DIRECT_CANCEL_HOURS_BEFORE_SLOT * 60 && minutes > 0) {
      return {
        tone: "warning",
        message: `Your slot starts ${slotTime}. Show this confirmation at check-in — cancellation window has closed.`,
      };
    }

    if (minutes <= 0) {
      return {
        tone: "info",
        message: `Your slot is in progress. Show this confirmation at check-in if you haven't already.`,
      };
    }

    return {
      tone: "info",
      message: `Your slot starts ${slotTime}. Show this confirmation at check-in.`,
    };
  }

  if (booking.lane === "wholesale" && booking.checkIn) {
    const checkInTime = formatHotelLocalTime(booking.hotelTimezone, parseISO(booking.checkIn));
    const supplier = booking.supplierName ?? "our partner";
    return {
      tone: "info",
      message: `Your stay is confirmed with ${booking.hotelName} via ${supplier}. Check-in from ${checkInTime}.`,
    };
  }

  if (booking.checkIn) {
    const checkInTime = formatHotelLocalTime(booking.hotelTimezone, parseISO(booking.checkIn));
    return {
      tone: "info",
      message: `Your booking is confirmed. Check-in from ${checkInTime}.`,
    };
  }

  return {
    tone: "info",
    message: "Your booking is confirmed.",
  };
}
