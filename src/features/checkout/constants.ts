import type { RestSlot } from "@/lib/booking/types";
import type { PaymentMethod } from "./types";

export const CHECKOUT_DRAFT_KEY = "resthalf-checkout-draft";

/** Mock slot hold duration until backend creates real holds on detail → checkout */
export const SLOT_HOLD_MINUTES = 15;

/** Shared slot window labels — keep in sync with SlotPicker on detail page */
export const SLOT_WINDOW_LABELS: Record<RestSlot, string> = {
  "00-12": "00:00 – 12:00",
  "12-24": "12:00 – 24:00",
  "24h": "Full 24 hours",
};

export function getSlotWindowLabel(slot: RestSlot): string {
  return SLOT_WINDOW_LABELS[slot];
}

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
}[] = [
  { id: "ewallet", label: "E-wallet", description: "GoPay, OVO, DANA via Xendit / Midtrans" },
  { id: "virtual_account", label: "Virtual account", description: "Bank transfer (BCA, Mandiri, BNI)" },
  { id: "card", label: "Card", description: "Visa, Mastercard, JCB" },
];

export const PHONE_COUNTRY_CODES = [
  { code: "+62", label: "Indonesia (+62)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+91", label: "India (+91)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US / Canada (+1)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+61", label: "Australia (+61)" },
] as const;

export const DEFAULT_PHONE_COUNTRY_CODE = "+62";
