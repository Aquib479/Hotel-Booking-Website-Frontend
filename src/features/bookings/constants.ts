import type { BookingTabStatus } from "./types";

export const BOOKINGS_STATUS_PARAM = "status";
export const BOOKINGS_LANE_PARAM = "lane";
export const BOOKINGS_SEARCH_PARAM = "q";
export const BOOKINGS_PAGE_PARAM = "page";

export const DEFAULT_BOOKING_STATUS: BookingTabStatus = "upcoming";
export const BOOKINGS_PER_PAGE = 10;

/** Direct upcoming rest slot within this window gets urgency treatment */
export const SLOT_STARTING_SOON_HOURS = 3;

export const BOOKING_STATUS_TABS: { id: BookingTabStatus; label: string }[] = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "cancelled", label: "Cancelled" },
];

export const LANE_FILTER_OPTIONS = [
  { id: "all" as const, label: "All" },
  { id: "direct" as const, label: "RestHalf Exclusive" },
  { id: "wholesale" as const, label: "Partner rate" },
];

/** v1: Direct → hotel detail; Wholesale → search by city (OTA inventory may differ) */
export const BOOK_AGAIN_DIRECT_TO_DETAIL = true;
export const BOOK_AGAIN_WHOLESALE_TO_SEARCH = true;

/** Wholesale cancellation: no live supplier API in v1 — support-request only */
export const WHOLESALE_CANCEL_API_ENABLED = false;

/** Refund tracker shows static last-known state (no polling) */
export const REFUND_STATUS_POLLING = false;

/** Refund amounts come from backend/refund engine — frontend does not compute policy math */
export const REFUND_ENGINE_PROVIDES_AMOUNT = true;

export const REFUND_TIMELINE_TEXT =
  "Refunds typically appear in 5–7 business days on your original payment method.";

export const SUPPORT_CONTACT_HREF = "mailto:support@resthalf.com?subject=Booking%20help";

import type { CancelReasonId } from "./types";

export const CANCEL_REASONS: {
  id: CancelReasonId;
  label: string;
  escalatesToSupport?: boolean;
}[] = [
  { id: "plans_changed", label: "Plans changed" },
  { id: "better_price", label: "Found a better price" },
  { id: "booked_by_mistake", label: "Booked by mistake" },
  { id: "hotel_issue", label: "Issue with the hotel", escalatesToSupport: true },
  { id: "other", label: "Other" },
];

export const WHOLESALE_CANCEL_RESPONSE_HOURS = 24;

/** Zero-refund cancellations still allowed once past preview (no-show waiver cases) */
export const ALLOW_ZERO_REFUND_CANCELLATION = true;

export const DIRECT_CANCEL_FLOW_STEPS = [
  { id: "reason" as const, label: "Reason" },
  { id: "preview" as const, label: "Refund preview" },
  { id: "confirmation" as const, label: "Confirmed" },
];
