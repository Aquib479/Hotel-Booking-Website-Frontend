import { parseISO, subHours } from "date-fns";
import type { RestSlot } from "./types";
import {
  getCalendarYmd,
  getHotelLocalMinutes,
  getHotelLocalYmd,
  isSameCalendarYmd,
} from "./timezone";

/** Direct bookings: free cancellation until this many hours before slot start (hotel-local). */
export const DIRECT_CANCEL_HOURS_BEFORE_SLOT = 2;

const SLOT_START_HOUR: Record<RestSlot, number> = {
  "00-12": 0,
  "12-24": 12,
  "24h": 0,
};

const SLOT_END_MINUTES: Record<RestSlot, number> = {
  "00-12": 12 * 60,
  "12-24": 24 * 60,
  "24h": 24 * 60,
};

function slotStartMinutes(slot: RestSlot): number {
  return SLOT_START_HOUR[slot] * 60;
}

function slotEndMinutes(slot: RestSlot): number {
  return SLOT_END_MINUTES[slot];
}

/** Hotel-local minutes until slot start (negative once started). */
export function getMinutesUntilSlotStart(
  slotDate: string,
  slotWindow: RestSlot,
  hotelTimezone: string,
  now = new Date()
): number {
  const date = parseISO(slotDate);
  const slotYmd = getCalendarYmd(date);
  const todayYmd = getHotelLocalYmd(hotelTimezone, now);

  if (!isSameCalendarYmd(slotYmd, todayYmd)) {
    const todayStart = new Date(todayYmd.year, todayYmd.month - 1, todayYmd.day).getTime();
    const slotDayStart = new Date(slotYmd.year, slotYmd.month - 1, slotYmd.day).getTime();
    const dayDiff = Math.round((slotDayStart - todayStart) / (24 * 60 * 60 * 1000));
    return dayDiff * 24 * 60 + slotStartMinutes(slotWindow) - getHotelLocalMinutes(hotelTimezone, now);
  }

  return slotStartMinutes(slotWindow) - getHotelLocalMinutes(hotelTimezone, now);
}

/** Hotel-local minutes until slot ends. */
export function getMinutesUntilSlotEnd(
  slotDate: string,
  slotWindow: RestSlot,
  hotelTimezone: string,
  now = new Date()
): number {
  const date = parseISO(slotDate);
  const slotYmd = getCalendarYmd(date);
  const todayYmd = getHotelLocalYmd(hotelTimezone, now);

  if (!isSameCalendarYmd(slotYmd, todayYmd)) {
    const todayStart = new Date(todayYmd.year, todayYmd.month - 1, todayYmd.day).getTime();
    const slotDayStart = new Date(slotYmd.year, slotYmd.month - 1, slotYmd.day).getTime();
    if (slotDayStart > todayStart) return Number.POSITIVE_INFINITY;
    return Number.NEGATIVE_INFINITY;
  }

  return slotEndMinutes(slotWindow) - getHotelLocalMinutes(hotelTimezone, now);
}

/** ISO instant for the free-cancellation cutoff (slot start minus policy hours). */
export function getDirectCancelCutoffIso(
  slotDate: string,
  slotWindow: RestSlot,
  _hotelTimezone: string
): string {
  const date = parseISO(slotDate);
  const startHour = SLOT_START_HOUR[slotWindow];
  const slotYmd = getCalendarYmd(date);

  const slotStartLocal = new Date(
    slotYmd.year,
    slotYmd.month - 1,
    slotYmd.day,
    startHour,
    0,
    0,
    0
  );

  return subHours(slotStartLocal, DIRECT_CANCEL_HOURS_BEFORE_SLOT).toISOString();
}

export function isDirectCancelEligible(
  slotDate: string,
  slotWindow: RestSlot,
  hotelTimezone: string,
  now = new Date()
): boolean {
  const minutesUntilStart = getMinutesUntilSlotStart(slotDate, slotWindow, hotelTimezone, now);
  return minutesUntilStart > DIRECT_CANCEL_HOURS_BEFORE_SLOT * 60;
}

export function isSlotInProgress(
  slotDate: string,
  slotWindow: RestSlot,
  hotelTimezone: string,
  now = new Date()
): boolean {
  const untilStart = getMinutesUntilSlotStart(slotDate, slotWindow, hotelTimezone, now);
  const untilEnd = getMinutesUntilSlotEnd(slotDate, slotWindow, hotelTimezone, now);
  return untilStart <= 0 && untilEnd > 0;
}
