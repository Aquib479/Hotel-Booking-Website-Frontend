import { format, isToday, parseISO } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import type { BookingMode, RestSlot } from "./types";
import { getSlotWindowLabel } from "@/features/checkout/constants";
import type { AppLanguage } from "@/lib/i18n/languages";
import { translate } from "@/lib/i18n/messages";

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
  options?: { compact?: boolean; language?: AppLanguage }
): RestSlotDisplay {
  const language = options?.language ?? "en";
  const locale = language === "id" ? idLocale : enUS;
  const date = parseISO(slotDate);
  const dateLabel =
    options?.compact && isToday(date)
      ? `${translate(language, "common.today")} · ${format(date, "MMM d", { locale })}`
      : format(date, "EEE, MMM d, yyyy", { locale });
  const windowLabel = getSlotWindowLabel(slotWindow, language);
  const duration = slotWindow === "24h" ? translate(language, "common.slot24") : translate(language, "common.slot12");

  return {
    primary: dateLabel,
    secondary: `${windowLabel} (${duration})`,
  };
}

export function formatStayRangeDisplay(
  checkIn: string,
  checkOut: string,
  nights?: number,
  language: AppLanguage = "en"
): StayRangeDisplay {
  const locale = language === "id" ? idLocale : enUS;
  const inDate = format(parseISO(checkIn), "MMM d", { locale });
  const outDate = format(parseISO(checkOut), "MMM d, yyyy", { locale });
  const nightCount = nights ?? 1;

  return {
    primary: `${inDate} – ${outDate}`,
    secondary:
      nightCount === 1
        ? translate(language, "common.nightOne")
        : translate(language, "common.nightsN", { n: nightCount }),
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
  options?: { compact?: boolean; language?: AppLanguage }
): RestSlotDisplay | StayRangeDisplay | null {
  const language = options?.language ?? "en";
  if (mode === "rest" && fields.slotDate && fields.slotWindow) {
    return formatRestSlotDisplay(fields.slotDate, fields.slotWindow, {
      compact: options?.compact,
      language,
    });
  }
  if (fields.checkIn && fields.checkOut) {
    return formatStayRangeDisplay(fields.checkIn, fields.checkOut, fields.nights, language);
  }
  return null;
}
