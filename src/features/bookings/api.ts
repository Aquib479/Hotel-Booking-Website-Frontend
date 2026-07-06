import type {
  BookingFilters,
  BookingsListResult,
  BookingDetail,
  CancelBookingResult,
  CancelReasonId,
  RefundPreview,
  WholesaleCancelRequestResult,
} from "./types";
import { BOOKINGS_PER_PAGE, REFUND_TIMELINE_TEXT } from "./constants";
import { buildMockBookings, classifyBookingStatus, enrichBookingDetail } from "./utils";
import { isDirectCancelEligible } from "@/lib/booking/cancellation";

const MOCK_CANCELLED_KEY = "resthalf-mock-cancelled-bookings";

function readCancelledIds(): Set<string> {
  try {
    const raw = localStorage.getItem(MOCK_CANCELLED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markCancelled(id: string) {
  const ids = readCancelledIds();
  ids.add(id);
  localStorage.setItem(MOCK_CANCELLED_KEY, JSON.stringify([...ids]));
}

export async function fetchBookingById(id: string): Promise<BookingDetail | null> {
  await new Promise((r) => setTimeout(r, 450));
  const cancelled = readCancelledIds();
  const booking = buildMockBookings().find((b) => b.id === id);
  if (!booking) return null;

  const detail = enrichBookingDetail(booking);
  if (cancelled.has(id)) {
    return {
      ...detail,
      cancelledAt: new Date().toISOString(),
      cancelReason: "Guest cancelled",
      refundStatus: "pending",
      refund: {
        status: "pending",
        originalAmount: detail.paidAmount,
        refundAmount: detail.paidAmount,
        currency: detail.paidCurrency,
        requestedAt: new Date().toISOString(),
        currentStep: "processing",
      },
    };
  }
  return detail;
}

/** Backend refund-calculation endpoint — sole source of refund numbers in the frontend */
export async function fetchRefundPreview(
  bookingId: string,
  reason: CancelReasonId
): Promise<RefundPreview> {
  await new Promise((r) => setTimeout(r, 650));

  const booking = buildMockBookings().find((b) => b.id === bookingId);
  if (!booking) throw new Error("Booking not found");

  const amountPaid = booking.paidAmount;
  const currency = booking.paidCurrency;

  let refundPercentage = 100;
  let policyExplanation = "Full refund — cancelled before the free cancellation cutoff.";
  let nonRefundableNote: string | undefined;

  if (
    booking.lane === "direct" &&
    booking.mode === "rest" &&
    booking.slotDate &&
    booking.slotWindow
  ) {
    const eligible = isDirectCancelEligible(
      booking.slotDate,
      booking.slotWindow,
      booking.hotelTimezone
    );
    if (!eligible) {
      refundPercentage = 0;
      policyExplanation = "No refund — cancellation is outside the free cancellation window.";
      nonRefundableNote = "The full slot rate is non-refundable per policy.";
    }
  }

  if (reason === "hotel_issue") {
    policyExplanation =
      "Full refund requested due to hotel issue — subject to review if escalated to support.";
  }

  const refundAmount = Math.round((amountPaid * refundPercentage) / 100);
  const nonRefundableAmount = amountPaid - refundAmount;

  return {
    amountPaid,
    currency,
    refundPercentage,
    refundAmount,
    nonRefundableAmount,
    policyExplanation,
    nonRefundableNote:
      nonRefundableAmount > 0
        ? nonRefundableNote ?? `${nonRefundableAmount} is non-refundable per cancellation policy.`
        : undefined,
    timelineText: REFUND_TIMELINE_TEXT,
  };
}

export async function submitCancellation(
  bookingId: string,
  reason: CancelReasonId,
  reasonDetail?: string
): Promise<CancelBookingResult> {
  await new Promise((r) => setTimeout(r, 800));
  const preview = await fetchRefundPreview(bookingId, reason);
  markCancelled(bookingId);
  void reasonDetail;
  return {
    success: true,
    refundAmount: preview.refundAmount,
    currency: preview.currency,
    timelineText: preview.timelineText,
  };
}

export async function submitWholesaleCancelRequest(
  bookingId: string,
  _reason: CancelReasonId,
  reasonDetail?: string
): Promise<WholesaleCancelRequestResult> {
  await new Promise((r) => setTimeout(r, 700));
  void reasonDetail;
  return {
    success: true,
    referenceId: `WCR-${bookingId.toUpperCase()}-${Date.now().toString(36)}`,
    estimatedResponseHours: 24,
  };
}

export async function fetchBookings(filters: BookingFilters): Promise<BookingsListResult> {
  await new Promise((r) => setTimeout(r, 500));

  const all = buildMockBookings().map((b) => {
    if (!readCancelledIds().has(b.id)) return b;
    return {
      ...b,
      cancelledAt: b.cancelledAt ?? new Date().toISOString(),
      cancelReason: b.cancelReason ?? "Guest cancelled",
      refundStatus: b.refundStatus ?? ("pending" as const),
    };
  });
  const counts = {
    upcoming: 0,
    past: 0,
    cancelled: 0,
  };

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
