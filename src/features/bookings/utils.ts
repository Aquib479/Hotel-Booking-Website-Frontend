import { addDays, parseISO, subDays } from "date-fns";
import type { RestSlot } from "@/lib/booking/types";
import { getMinutesUntilSlotStart as getSlotStartMinutes } from "@/lib/booking/cancellation";
import {
  getCalendarYmd,
  getHotelLocalMinutes,
  getHotelLocalYmd,
  isSameCalendarYmd,
} from "@/lib/booking/timezone";
import { getPropertyById } from "@/features/property/data";
import type { BookingDetail, BookingRecord, BookingTabStatus } from "./types";
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

export function buildMockBookings(now = new Date()): BookingRecord[] {
  const today = now.toISOString();
  const localMinutes = getHotelLocalMinutes("Asia/Kolkata", now);
  const soonSlot: RestSlot = localMinutes < 9 * 60 ? "12-24" : "00-12";
  const soonDate =
    soonSlot === "00-12" && localMinutes >= 9 * 60
      ? addDays(now, 1).toISOString()
      : now.toISOString();

  const base = (
    id: string,
    overrides: Partial<BookingRecord> & Pick<BookingRecord, "hotelName" | "lane" | "mode">
  ): BookingRecord => ({
    ...overrides,
    id,
    confirmationCode: overrides.confirmationCode ?? `RH-${id.toUpperCase()}`,
    propertyId: overrides.propertyId ?? id,
    hotelImage:
      overrides.hotelImage ??
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    city: overrides.city ?? "Bangalore",
    country: overrides.country ?? "India",
    hotelTimezone: overrides.hotelTimezone ?? "Asia/Kolkata",
    paidAmount: overrides.paidAmount ?? 350000,
    paidCurrency: overrides.paidCurrency ?? "IDR",
    bookedAt: overrides.bookedAt ?? subDays(now, 2).toISOString(),
  });

  return [
    base("b1", {
      hotelName: "RestHalf Airport Transit Hotel",
      propertyId: "1",
      lane: "direct",
      mode: "rest",
      slotDate: soonDate,
      slotWindow: soonSlot,
      hotelTimezone: "Asia/Kolkata",
      paidAmount: 350000,
      paidCurrency: "IDR",
    }),
    base("b2", {
      hotelName: "Layover Lounge Suites",
      propertyId: "3",
      lane: "direct",
      mode: "rest",
      slotDate: addDays(now, 14).toISOString(),
      slotWindow: "12-24",
      hotelTimezone: "Europe/London",
      city: "London",
      country: "United Kingdom",
      paidAmount: 45,
      paidCurrency: "GBP",
    }),
    base("b3", {
      hotelName: "Skyline Business Hotel",
      propertyId: "2",
      lane: "wholesale",
      mode: "stay",
      checkIn: addDays(now, 5).toISOString(),
      checkOut: addDays(now, 7).toISOString(),
      nights: 2,
      hotelTimezone: "Asia/Kolkata",
      paidAmount: 170,
      paidCurrency: "USD",
    }),
    base("b4", {
      hotelName: "Dubai Transit Rest Pod",
      propertyId: "7",
      lane: "direct",
      mode: "rest",
      slotDate: subDays(now, 3).toISOString(),
      slotWindow: "12-24",
      hotelTimezone: "Asia/Dubai",
      city: "Dubai",
      country: "UAE",
      paidAmount: 55,
      paidCurrency: "USD",
    }),
    base("b5", {
      hotelName: "City Center Grand",
      propertyId: "4",
      lane: "wholesale",
      mode: "stay",
      checkIn: subDays(now, 30).toISOString(),
      checkOut: subDays(now, 28).toISOString(),
      nights: 2,
      hotelTimezone: "America/Toronto",
      city: "Toronto",
      country: "Canada",
      paidAmount: 240,
      paidCurrency: "USD",
    }),
    base("b6", {
      hotelName: "RestHalf Airport Transit Hotel",
      propertyId: "1",
      lane: "direct",
      mode: "rest",
      slotDate: subDays(now, 1).toISOString(),
      slotWindow: "00-12",
      cancelledAt: subDays(now, 1).toISOString(),
      cancelReason: "Guest cancelled",
      refundStatus: "pending",
      paidAmount: 350000,
      paidCurrency: "IDR",
    }),
    base("b7", {
      hotelName: "Marina Bay Partner Hotel",
      propertyId: "5",
      lane: "wholesale",
      mode: "stay",
      checkIn: addDays(now, 10).toISOString(),
      checkOut: addDays(now, 12).toISOString(),
      nights: 2,
      hotelTimezone: "Asia/Singapore",
      city: "Singapore",
      country: "Singapore",
      cancelledAt: today,
      cancelReason: "Payment failed",
      refundStatus: "none",
      paidAmount: 320,
      paidCurrency: "USD",
    }),
  ];
}

export function enrichBookingDetail(record: BookingRecord): BookingDetail {
  const property = getPropertyById(record.propertyId);

  const policy =
    record.lane === "direct"
      ? {
          headline: "Free cancellation up to 2 hours before slot start",
          bullets: [
            "Cancel free of charge up to 2 hours before your slot begins.",
            "Cancellations within 2 hours are charged the full slot rate.",
            "No-shows are non-refundable.",
            "Refunds are processed within 5–7 business days to your original payment method.",
          ],
        }
      : {
          headline: "Subject to partner cancellation policy",
          bullets: [
            `This rate was provided by ${property?.supplierName ?? "our partner supplier"} at time of booking.`,
            "Cancellation and refund rules follow the supplier's policy as captured below.",
            "RestHalf cannot override partner policies once the handoff is complete.",
            "Contact RestHalf support to request a cancellation.",
          ],
        };

  const refund =
    record.refundStatus && record.refundStatus !== "none"
      ? {
          status: record.refundStatus,
          originalAmount: record.paidAmount,
          refundAmount:
            record.refundStatus === "refunded"
              ? Math.round(record.paidAmount * 0.8)
              : record.paidAmount,
          currency: record.paidCurrency,
          partialReason:
            record.refundStatus === "refunded"
              ? "Refunded per cancellation policy: 80% of total"
              : undefined,
          requestedAt: record.cancelledAt,
          refundedAt: record.refundStatus === "refunded" ? record.cancelledAt : undefined,
          currentStep:
            record.refundStatus === "refunded"
              ? ("refunded" as const)
              : record.refundStatus === "pending"
                ? ("processing" as const)
                : ("requested" as const),
        }
      : undefined;

  return {
    ...record,
    address: property?.address ?? `${record.city}, ${record.country}`,
    starRating: property?.starRating ?? 4,
    guests: { adults: 2, children: 0 },
    roomType: property?.roomType,
    ratePlanName:
      record.lane === "wholesale"
        ? "Deluxe Room, Breakfast Included"
        : record.mode === "rest"
          ? "Rest slot"
          : "Standard room",
    supplierName: property?.supplierName,
    guest: {
      fullName: "Guest Traveler",
      email: "guest@example.com",
      phoneE164: "+628123456789",
      specialRequests: record.mode === "rest" ? "Late check-in if possible" : undefined,
    },
    payment: {
      method: record.paidCurrency === "IDR" ? "ewallet" : "card",
      methodLabel: record.paidCurrency === "IDR" ? "GoPay" : "Visa •••• 4242",
      transactionId: `TXN-${record.confirmationCode}`,
      supplierBookingRef:
        record.lane === "wholesale" ? `SUP-${record.confirmationCode}` : undefined,
    },
    policy,
    refund,
  };
}
