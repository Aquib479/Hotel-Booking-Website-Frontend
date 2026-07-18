import { parseISO } from "date-fns";
import type { RestSlot } from "@/lib/booking/types";
import { getMinutesUntilSlotStart as getSlotStartMinutes } from "@/lib/booking/cancellation";
import {
  getCalendarYmd,
  getHotelLocalMinutes,
  getHotelLocalYmd,
  isSameCalendarYmd,
} from "@/lib/booking/timezone";
import type { BookingRecord, BookingTabStatus } from "./types";
import { SLOT_STARTING_SOON_HOURS } from "./constants";

function slotEndMinutes(slot: RestSlot): number {
  switch (slot) {
    case "00-12":
      return 12 * 60;
    case "12-24":
      return 24 * 60;
    case "24h":
      return 24 * 60;
    default:
      return 24 * 60;
  }
}

/** Minutes until rest slot starts (negative if already started). Hotel-local. */
export function getMinutesUntilSlotStart(booking: BookingRecord, now = new Date()): number | null {
  if (booking.mode !== "rest" || !booking.slotDate || !booking.slotWindow) return null;
  return getSlotStartMinutes(
    booking.slotDate,
    booking.slotWindow,
    booking.hotelTimezone,
    now
  );
}

export function isSlotStartingSoon(booking: BookingRecord, now = new Date()): boolean {
  if (booking.lane !== "direct") return false;
  const minutes = getMinutesUntilSlotStart(booking, now);
  if (minutes === null) return false;
  return minutes >= 0 && minutes <= SLOT_STARTING_SOON_HOURS * 60;
}

export function classifyBookingStatus(booking: BookingRecord, now = new Date()): BookingTabStatus {
  if (booking.cancelledAt) return "cancelled";

  if (booking.mode === "rest" && booking.slotDate && booking.slotWindow) {
    const minutesUntilEnd = (() => {
      const slotDate = parseISO(booking.slotDate!);
      const slotYmd = getCalendarYmd(slotDate);
      const todayYmd = getHotelLocalYmd(booking.hotelTimezone, now);
      if (!isSameCalendarYmd(slotYmd, todayYmd)) {
        const todayStart = new Date(todayYmd.year, todayYmd.month - 1, todayYmd.day).getTime();
        const slotDayStart = new Date(slotYmd.year, slotYmd.month - 1, slotYmd.day).getTime();
        if (slotDayStart > todayStart) return Number.POSITIVE_INFINITY;
        return Number.NEGATIVE_INFINITY;
      }
      return slotEndMinutes(booking.slotWindow!) - getHotelLocalMinutes(booking.hotelTimezone, now);
    })();
    return minutesUntilEnd > 0 ? "upcoming" : "past";
  }

  if (booking.checkOut) {
    return parseISO(booking.checkOut).getTime() > now.getTime() ? "upcoming" : "past";
  }

  return "past";
}

