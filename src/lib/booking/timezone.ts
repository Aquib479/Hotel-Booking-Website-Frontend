/**
 * IANA timezone helpers for slot cutoffs and checkout hold countdowns.
 * All slot windows are evaluated in the hotel's local timezone.
 */

/** Fallback when city/country is unknown */
export const DEFAULT_HOTEL_TIMEZONE = "UTC";

const CITY_TIMEZONE: Record<string, string> = {
  Bangalore: "Asia/Kolkata",
  Mumbai: "Asia/Kolkata",
  "New Delhi": "Asia/Kolkata",
  London: "Europe/London",
  Paris: "Europe/Paris",
  Toronto: "America/Toronto",
  Tokyo: "Asia/Tokyo",
  "New York": "America/New_York",
  Dubai: "Asia/Dubai",
  Singapore: "Asia/Singapore",
  Sydney: "Australia/Sydney",
  Zurich: "Europe/Zurich",
  Interlaken: "Europe/Zurich",
  Malé: "Indian/Maldives",
};

const COUNTRY_TIMEZONE: Record<string, string> = {
  India: "Asia/Kolkata",
  "United Kingdom": "Europe/London",
  France: "Europe/Paris",
  Canada: "America/Toronto",
  Japan: "Asia/Tokyo",
  "United States": "America/New_York",
  USA: "America/New_York",
  "United Arab Emirates": "Asia/Dubai",
  UAE: "Asia/Dubai",
  Singapore: "Asia/Singapore",
  Australia: "Australia/Sydney",
  Switzerland: "Europe/Zurich",
  Maldives: "Indian/Maldives",
};

export function getTimezoneForCity(city: string, country?: string): string {
  const cityMatch = CITY_TIMEZONE[city];
  if (cityMatch) return cityMatch;
  if (country) {
    const countryMatch = COUNTRY_TIMEZONE[country];
    if (countryMatch) return countryMatch;
  }
  return DEFAULT_HOTEL_TIMEZONE;
}

/** Calendar date chosen in a date picker (Y-M-D the guest selected). */
export function getCalendarYmd(date: Date): { year: number; month: number; day: number } {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

/** Current calendar date at the hotel. */
export function getHotelLocalYmd(
  hotelTimezone: string,
  instant: Date = new Date()
): { year: number; month: number; day: number } {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: hotelTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);

  const [year, month, day] = formatted.split("-").map(Number);
  return { year, month, day };
}

export function isSameCalendarYmd(
  a: { year: number; month: number; day: number },
  b: { year: number; month: number; day: number }
): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/** True when the picked rest date is "today" at the hotel. */
export function isRestDateTodayInHotel(
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): boolean {
  return isSameCalendarYmd(getCalendarYmd(restDate), getHotelLocalYmd(hotelTimezone, now));
}

/** Minutes since local midnight at the hotel (0–1439). */
export function getHotelLocalMinutes(hotelTimezone: string, instant: Date = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: hotelTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

/**
 * Earliest selectable rest date for the picker — hotel-local "today".
 * Constructed in browser-local midnight so react-day-picker compares calendar days correctly.
 */
export function getEarliestSelectableRestDate(
  hotelTimezone: string,
  now: Date = new Date()
): Date {
  const { year, month, day } = getHotelLocalYmd(hotelTimezone, now);
  return new Date(year, month - 1, day);
}

/** Formatted hotel-local time string, e.g. "14:35 GST" — useful for checkout countdown UI. */
export function formatHotelLocalTime(
  hotelTimezone: string,
  instant: Date = new Date(),
  options?: { includeTimezoneName?: boolean }
): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: hotelTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    ...(options?.includeTimezoneName && { timeZoneName: "short" }),
  }).format(instant);
}

export interface SlotCutoffContext {
  hotelTimezone: string;
  isToday: boolean;
  localMinutesNow: number;
  remainingMinutesForSlot: (slotEndHour: number) => number;
}

/** Shared context for slot pickers and checkout hold countdowns. */
export function getSlotCutoffContext(
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): SlotCutoffContext {
  const isToday = isRestDateTodayInHotel(restDate, hotelTimezone, now);
  const localMinutesNow = getHotelLocalMinutes(hotelTimezone, now);

  return {
    hotelTimezone,
    isToday,
    localMinutesNow,
    remainingMinutesForSlot: (slotEndHour: number) => {
      if (!isToday) return Number.POSITIVE_INFINITY;
      return slotEndHour * 60 - localMinutesNow;
    },
  };
}
