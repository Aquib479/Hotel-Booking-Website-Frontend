import type { RestSlot } from "./types";
import type { Property } from "@/features/search/types";
import {
  getHotelLocalMinutes,
  getSlotCutoffContext,
  isRestDateTodayInHotel,
} from "./timezone";

/** Minutes of usable slot time required to allow same-day booking */
export const MIN_SLOT_REMAINING_MINUTES = 60;

const SLOT_WINDOW: Record<RestSlot, { startHour: number; endHour: number }> = {
  "00-12": { startHour: 0, endHour: 12 },
  "12-24": { startHour: 12, endHour: 24 },
  "24h": { startHour: 0, endHour: 24 },
};

export const ALL_REST_SLOTS: RestSlot[] = ["00-12", "12-24", "24h"];

/** Direct inventory only — wholesale is excluded from Rest search results */
export function supportsRestMode(property: Property): boolean {
  return property.lane === "direct";
}

/**
 * Stay mode: wholesale nightly inventory, plus Direct hotels with 24h overnight slots.
 * Direct 12h-only properties are Rest-only and must not appear in Stay search.
 */
export function supportsStayMode(property: Property): boolean {
  if (property.lane === "wholesale") return true;
  return property.lane === "direct" && property.slotDuration === "24h";
}

export function isSlotBookable(
  slot: RestSlot,
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): boolean {
  if (!isRestDateTodayInHotel(restDate, hotelTimezone, now)) return true;

  const { endHour } = SLOT_WINDOW[slot];
  const remainingMinutes = getSlotCutoffContext(restDate, hotelTimezone, now).remainingMinutesForSlot(
    endHour
  );

  return remainingMinutes >= MIN_SLOT_REMAINING_MINUTES;
}

export function getAvailableSlots(
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): RestSlot[] {
  return ALL_REST_SLOTS.filter((slot) => isSlotBookable(slot, restDate, hotelTimezone, now));
}

export function resolveSlotSelection(
  slot: RestSlot | undefined,
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): RestSlot | undefined {
  const available = getAvailableSlots(restDate, hotelTimezone, now);
  if (available.length === 0) return undefined;
  if (slot && available.includes(slot)) return slot;
  return available[0];
}

export function slotUnavailableMessage(
  slot: RestSlot,
  restDate: Date,
  hotelTimezone: string,
  now: Date = new Date()
): string {
  if (!isRestDateTodayInHotel(restDate, hotelTimezone, now)) {
    return "This slot is not available.";
  }

  const { endHour } = SLOT_WINDOW[slot];
  const endLabel = endHour === 24 ? "midnight" : `${endHour}:00`;
  const localTime = formatHotelLocalTimeShort(hotelTimezone, now);

  return `The ${slotLabel(slot)} slot has passed or has less than ${MIN_SLOT_REMAINING_MINUTES} minutes remaining in hotel local time (${localTime}, ends ${endLabel}). Pick a later slot or another date.`;
}

function slotLabel(slot: RestSlot): string {
  if (slot === "12-24") return "12:00–24:00";
  if (slot === "00-12") return "00:00–12:00";
  return "24-hour";
}

function formatHotelLocalTimeShort(hotelTimezone: string, now: Date): string {
  const minutes = getHotelLocalMinutes(hotelTimezone, now);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export { getSlotCutoffContext } from "./timezone";
