import { api } from "@/services/api";
import type { RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";
import type {
  BookingFilters,
  BookingsListResult,
  BookingDetail,
  BookingRecord,
  BookingTabStatus,
  CancelBookingResult,
  CancelReasonId,
  RefundPreview,
  WholesaleCancelRequestResult,
} from "./types";
import { BOOKINGS_PER_PAGE, REFUND_TIMELINE_TEXT } from "./constants";
import { classifyBookingStatus } from "./utils";

import { AUTH_TOKEN_KEY } from "@/features/auth/constants";

function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

interface ApiBookingResponse {
  id: string;
  status: string;
  slotType: string;
  numGuests: number;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: string;
  holdExpiresAt: string | null;
  paymentOrderId: string | null;
  paymentExpiresAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  room: {
    id: string;
    roomNumber: string;
    roomType: string;
  } | null;
  hotel: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    country: string | null;
    rating: number | null;
    imageUrl: string | null;
  } | null;
  guest: {
    fullName: string;
    email: string | null;
    phone: string;
  } | null;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";

function slotWindowFromType(slotType: string, checkIn: string): RestSlot {
  if (slotType === "FULL_DAY") return "24h";
  const hour = new Date(checkIn).getUTCHours();
  return hour < 12 ? "00-12" : "12-24";
}

function toBookingRecord(raw: ApiBookingResponse): BookingRecord {
  const slotWindow = slotWindowFromType(raw.slotType, raw.checkIn);
  return {
    id: raw.id,
    confirmationCode: raw.paymentOrderId ?? `RH-${raw.id.slice(0, 8).toUpperCase()}`,
    propertyId: raw.hotel?.id ?? "",
    hotelName: raw.hotel?.name ?? "Unknown Hotel",
    hotelImage: raw.hotel?.imageUrl ?? FALLBACK_IMAGE,
    city: raw.hotel?.city ?? "",
    country: raw.hotel?.country ?? "",
    lane: "direct",
    mode: "rest",
    slotDate: raw.checkIn,
    slotWindow,
    hotelTimezone: "Asia/Kolkata",
    paidAmount: raw.totalPrice,
    paidCurrency: (raw.currency as CurrencyCode) || "IDR",
    bookedAt: raw.createdAt,
    cancelledAt: raw.cancelledAt ?? undefined,
    cancelReason: raw.cancelledAt ? "Cancelled" : undefined,
    refundStatus: raw.cancelledAt ? "pending" : undefined,
  };
}

function toBookingDetail(raw: ApiBookingResponse): BookingDetail {
  const record = toBookingRecord(raw);
  return {
    ...record,
    address: raw.hotel?.address ?? `${record.city}, ${record.country}`,
    starRating: raw.hotel?.rating ?? 4,
    guests: { adults: raw.numGuests, children: 0 },
    roomType: raw.room?.roomType ?? undefined,
    ratePlanName: raw.slotType === "FULL_DAY" ? "Full-day rest slot" : "Half-day rest slot",
    supplierName: undefined,
    guest: {
      fullName: raw.guest?.fullName ?? "Guest",
      email: raw.guest?.email ?? "",
      phoneE164: raw.guest?.phone ?? "",
    },
    payment: {
      method: raw.currency === "IDR" ? "ewallet" : "card",
      methodLabel: raw.currency === "IDR" ? "GoPay" : "Card",
      transactionId: raw.paymentOrderId ?? "",
    },
    policy: {
      headline: "Free cancellation before slot start",
      bullets: [
        "Cancel before the slot begins for a full refund.",
        "No refund once the slot has started.",
      ],
    },
    refund: record.cancelledAt
      ? {
          status: "pending",
          originalAmount: record.paidAmount,
          refundAmount: record.paidAmount,
          currency: record.paidCurrency,
          requestedAt: record.cancelledAt,
          currentStep: "processing",
        }
      : undefined,
  };
}

export async function fetchBookingById(id: string): Promise<BookingDetail | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const raw = await api.get<ApiBookingResponse>(`/bookings/${id}`, { token });
    return toBookingDetail(raw);
  } catch {
    return null;
  }
}

export async function fetchRefundPreview(
  _bookingId: string,
  _reason: CancelReasonId
): Promise<RefundPreview> {
  const booking = await fetchBookingById(_bookingId);
  if (!booking) throw new Error("Booking not found");

  return {
    amountPaid: booking.paidAmount,
    currency: booking.paidCurrency,
    refundPercentage: 100,
    refundAmount: booking.paidAmount,
    nonRefundableAmount: 0,
    policyExplanation: "Full refund — cancelled before the rest slot began.",
    timelineText: REFUND_TIMELINE_TEXT,
  };
}

export async function submitCancellation(
  bookingId: string,
  _reason: CancelReasonId,
  _reasonDetail?: string
): Promise<CancelBookingResult> {
  const token = getToken();
  await api.post(`/bookings/${bookingId}/release`, undefined, { token });
  return {
    success: true,
    refundAmount: 0,
    currency: "IDR",
    timelineText: REFUND_TIMELINE_TEXT,
  };
}

export async function submitWholesaleCancelRequest(
  bookingId: string,
  _reason: CancelReasonId,
  _reasonDetail?: string
): Promise<WholesaleCancelRequestResult> {
  return {
    success: true,
    referenceId: `WCR-${bookingId.toUpperCase()}-${Date.now().toString(36)}`,
    estimatedResponseHours: 24,
  };
}

export async function fetchBookings(filters: BookingFilters): Promise<BookingsListResult> {
  const token = getToken();
  if (!token) {
    return { bookings: [], total: 0, counts: { upcoming: 0, past: 0, cancelled: 0 } };
  }

  const rawList = await api.get<ApiBookingResponse[]>("/bookings/my", { token });
  const all = rawList.map(toBookingRecord);

  const counts: Record<BookingTabStatus, number> = { upcoming: 0, past: 0, cancelled: 0 };
  all.forEach((b) => {
    counts[classifyBookingStatus(b)] += 1;
  });

  let filtered = all.filter((b) => classifyBookingStatus(b) === filters.status);

  if (filters.lane !== "all") {
    filtered = filtered.filter((b) => b.lane === filters.lane);
  }

  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.hotelName.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        b.confirmationCode.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const start = (filters.page - 1) * BOOKINGS_PER_PAGE;
  const bookings = filtered.slice(start, start + BOOKINGS_PER_PAGE);

  return { bookings, total, counts };
}
