import { addDays, isBefore, isEqual, startOfDay } from "date-fns";

/** Calendar-day start for "today" (local). */
export function getTodayStart(now: Date = new Date()): Date {
  return startOfDay(now);
}

/** Default stay: check-in today, check-out tomorrow. */
export function defaultStayDates(now: Date = new Date()): {
  checkIn: Date;
  checkOut: Date;
} {
  const checkIn = getTodayStart(now);
  return { checkIn, checkOut: addDays(checkIn, 1) };
}

/**
 * Clamp stay dates so check-in is never before today and check-out is
 * always after check-in (at least 1 night).
 */
export function normalizeStayDates(
  checkIn?: Date | null,
  checkOut?: Date | null,
  now: Date = new Date(),
): { checkIn: Date; checkOut: Date } {
  const today = getTodayStart(now);
  let nextCheckIn = checkIn ? startOfDay(checkIn) : today;
  if (isBefore(nextCheckIn, today)) {
    nextCheckIn = today;
  }

  let nextCheckOut = checkOut ? startOfDay(checkOut) : addDays(nextCheckIn, 1);
  if (isBefore(nextCheckOut, nextCheckIn) || isEqual(nextCheckOut, nextCheckIn)) {
    nextCheckOut = addDays(nextCheckIn, 1);
  }

  return { checkIn: nextCheckIn, checkOut: nextCheckOut };
}

/** Earliest selectable check-out day (day after check-in). */
export function getEarliestCheckoutDate(checkIn: Date): Date {
  return addDays(startOfDay(checkIn), 1);
}
