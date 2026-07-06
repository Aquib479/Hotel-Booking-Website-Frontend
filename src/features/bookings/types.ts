import type { BookingLane, BookingMode, RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";

export type BookingTabStatus = "upcoming" | "past" | "cancelled";

export type LaneFilter = "all" | BookingLane;

export type RefundStatus = "none" | "pending" | "refunded" | "failed";

export type RefundStep = "requested" | "processing" | "refunded";

export type CancelHandledBy = "self-serve" | "support-request" | "none";

export interface BookingGuestInfo {
  fullName: string;
  email: string;
  phoneE164: string;
  specialRequests?: string;
}

export interface BookingPaymentInfo {
  method: string;
  methodLabel: string;
  transactionId: string;
  supplierBookingRef?: string;
}

export interface BookingPolicySnapshot {
  headline: string;
  bullets: string[];
}

export interface BookingRefundInfo {
  status: RefundStatus;
  originalAmount: number;
  refundAmount?: number;
  currency: CurrencyCode;
  partialReason?: string;
  requestedAt?: string;
  refundedAt?: string;
  currentStep: RefundStep;
}

export interface BookingRecord {
  id: string;
  confirmationCode: string;
  propertyId: string;
  hotelName: string;
  hotelImage: string;
  city: string;
  country: string;
  lane: BookingLane;
  mode: BookingMode;
  slotDate?: string;
  slotWindow?: RestSlot;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  hotelTimezone: string;
  paidAmount: number;
  paidCurrency: CurrencyCode;
  bookedAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  refundStatus?: RefundStatus;
}

export interface BookingDetail extends BookingRecord {
  address: string;
  starRating: number;
  guests: { adults: number; children: number };
  roomType?: string;
  ratePlanName?: string;
  supplierName?: string;
  guest: BookingGuestInfo;
  payment: BookingPaymentInfo;
  policy: BookingPolicySnapshot;
  refund?: BookingRefundInfo;
}

export interface BookingEligibility {
  canCancel: boolean;
  cancelCutoffPassed: boolean;
  cancelCutoffTime?: string;
  cancelHandledBy: CancelHandledBy;
  slotInProgress: boolean;
  showContactSupport: boolean;
}

export interface BookingFilters {
  status: BookingTabStatus;
  lane: LaneFilter;
  search: string;
  page: number;
}

export interface BookingsListResult {
  bookings: BookingRecord[];
  total: number;
  counts: Record<BookingTabStatus, number>;
}

export interface BookingsListState {
  bookings: BookingRecord[];
  total: number;
  counts: Record<BookingTabStatus, number>;
  isLoading: boolean;
  error: string | null;
}

export type CancelReasonId =
  | "plans_changed"
  | "better_price"
  | "booked_by_mistake"
  | "hotel_issue"
  | "other";

export type CancelFlowStep = "reason" | "preview" | "confirmation";

export interface RefundPreview {
  amountPaid: number;
  currency: CurrencyCode;
  refundPercentage: number;
  refundAmount: number;
  nonRefundableAmount: number;
  policyExplanation: string;
  nonRefundableNote?: string;
  timelineText: string;
}

export interface CancelBookingResult {
  success: boolean;
  refundAmount: number;
  currency: CurrencyCode;
  timelineText: string;
}

export interface WholesaleCancelRequestResult {
  success: boolean;
  referenceId: string;
  estimatedResponseHours: number;
}
