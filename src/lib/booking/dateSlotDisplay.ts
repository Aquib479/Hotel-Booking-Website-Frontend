import { format, isToday, parseISO } from "date-fns";
import type { BookingMode, RestSlot } from "./types";
import { getSlotWindowLabel } from "@/features/checkout/constants";

export interface RestSlotDisplay {
  primary: string;
  secondary: string;
}

export interface StayRangeDisplay {
  primary: string;
  secondary: string;
}

export function formatRestSlotDisplay(
  slotDate: string,
  slotWindow: RestSlot,
  options?: { compact?: boolean }
): RestSlotDisplay {
  const date = parseISO(slotDate);
  const dateLabel = options?.compact && isToday(date)
    ? `Today · ${format(date, "MMM d")}`
    : format(date, "EEE, MMM d, yyyy");
  const windowLabel = getSlotWindowLabel(slotWindow);
  const duration = slotWindow === "24h" ? "24h slot" : "12h slot";

  return {
    primary: dateLabel,
    secondary: `${windowLabel} (${duration})`,
  };
}

export function formatStayRangeDisplay(
  checkIn: string,
  checkOut: string,
  nights?: number
): StayRangeDisplay {
  const inDate = format(parseISO(checkIn), "MMM d");
  const outDate = format(parseISO(checkOut), "MMM d, yyyy");
  const nightCount = nights ?? 1;

  return {
    primary: `${inDate} – ${outDate}`,
    secondary: `${nightCount} night${nightCount !== 1 ? "s" : ""}`,
  };
}

export function getBookingDateOrSlotDisplay(
  mode: BookingMode,
  fields: {
    slotDate?: string;
    slotWindow?: RestSlot;
    checkIn?: string;
    checkOut?: string;
    nights?: number;
  },
  options?: { compact?: boolean }
): RestSlotDisplay | StayRangeDisplay | null {
  if (mode === "rest" && fields.slotDate && fields.slotWindow) {
    return formatRestSlotDisplay(fields.slotDate, fields.slotWindow, options);
  }
  if (fields.checkIn && fields.checkOut) {
    return formatStayRangeDisplay(fields.checkIn, fields.checkOut, fields.nights);
  }
  return null;
}
