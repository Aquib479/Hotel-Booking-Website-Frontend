import { format, parseISO } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { formatPrice } from "@/lib/currency/format";
import {
  DIRECT_CANCEL_HOURS_BEFORE_SLOT,
  getMinutesUntilSlotStart,
} from "@/lib/booking/cancellation";
import { formatHotelLocalTime } from "@/lib/booking/timezone";
import type { AppLanguage } from "@/lib/i18n/languages";
import { translate } from "@/lib/i18n/messages";
import type { BookingDetail } from "./types";
import { classifyBookingStatus } from "./utils";

export interface StatusBannerMessage {
  tone: "info" | "success" | "warning" | "muted";
  message: string;
}

function formatSlotStartTime(booking: BookingDetail, language: AppLanguage): string {
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
  const localeTag = language === "id" ? "id-ID" : "en-US";
  const label = new Intl.DateTimeFormat(localeTag, {
    timeZone: booking.hotelTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: language !== "id",
  }).format(new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0));

  const dfLocale = language === "id" ? idLocale : enUS;
  if (isToday) return translate(language, "bookings.status.todayAt", { time: label });
  return translate(language, "bookings.status.onDateAt", {
    date: format(date, "MMM d", { locale: dfLocale }),
    time: label,
  });
}

export function resolveStatusBannerMessage(
  booking: BookingDetail,
  now = new Date(),
  language: AppLanguage = "en",
): StatusBannerMessage {
  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(language, key, vars);
  const status = classifyBookingStatus(booking, now);
  const dfLocale = language === "id" ? idLocale : enUS;

  if (status === "cancelled") {
    if (booking.refund?.status === "pending" || booking.refundStatus === "pending") {
      const amount = booking.refund?.refundAmount ?? booking.paidAmount;
      const cancelledDate = booking.cancelledAt
        ? format(parseISO(booking.cancelledAt), "MMM d, yyyy", { locale: dfLocale })
        : t("bookings.status.recently");
      return {
        tone: "warning",
        message: t("bookings.status.refundProcessing", {
          date: cancelledDate,
          amount: formatPrice(amount, booking.paidCurrency),
        }),
      };
    }
    if (booking.refund?.status === "refunded" || booking.refundStatus === "refunded") {
      return {
        tone: "muted",
        message: t("bookings.status.refunded"),
      };
    }
    return {
      tone: "muted",
      message: booking.cancelReason
        ? t("bookings.status.cancelledReason", { reason: booking.cancelReason })
        : t("bookings.status.cancelled"),
    };
  }

  if (status === "past") {
    return {
      tone: "success",
      message: t("bookings.status.complete"),
    };
  }

  if (booking.lane === "direct" && booking.mode === "rest" && booking.slotDate && booking.slotWindow) {
    const minutes = getMinutesUntilSlotStart(
      booking.slotDate,
      booking.slotWindow,
      booking.hotelTimezone,
      now,
    );
    const slotTime = formatSlotStartTime(booking, language);

    if (minutes <= DIRECT_CANCEL_HOURS_BEFORE_SLOT * 60 && minutes > 0) {
      return {
        tone: "warning",
        message: t("bookings.status.slotSoonClosed", { time: slotTime }),
      };
    }

    if (minutes <= 0) {
      return {
        tone: "info",
        message: t("bookings.status.slotInProgress"),
      };
    }

    return {
      tone: "info",
      message: t("bookings.status.slotStarts", { time: slotTime }),
    };
  }

  if (booking.lane === "wholesale" && booking.checkIn) {
    const checkInTime = formatHotelLocalTime(booking.hotelTimezone, parseISO(booking.checkIn));
    const supplier = booking.supplierName ?? t("bookings.partnerFallback");
    return {
      tone: "info",
      message: t("bookings.status.wholesaleStay", {
        hotel: booking.hotelName,
        supplier,
        time: checkInTime,
      }),
    };
  }

  if (booking.checkIn) {
    const checkInTime = formatHotelLocalTime(booking.hotelTimezone, parseISO(booking.checkIn));
    return {
      tone: "info",
      message: t("bookings.status.checkinFrom", { time: checkInTime }),
    };
  }

  return {
    tone: "info",
    message: t("bookings.status.confirmed"),
  };
}
