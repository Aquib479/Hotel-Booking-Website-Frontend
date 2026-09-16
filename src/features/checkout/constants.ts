import type { RestSlot } from "@/lib/booking/types";
import type { AppLanguage } from "@/lib/i18n/languages";
import { translate } from "@/lib/i18n/messages";
import {
  DEFAULT_PHONE_COUNTRY_CODE,
  PHONE_COUNTRY_CODES,
} from "@/lib/phone/constants";
import type { PaymentMethod } from "./types";

export { DEFAULT_PHONE_COUNTRY_CODE, PHONE_COUNTRY_CODES };

export const CHECKOUT_DRAFT_KEY = "resthalf-checkout-draft";

/** Mock slot hold duration until backend creates real holds on detail → checkout */
export const SLOT_HOLD_MINUTES = 15;

/** Shared slot window labels — keep in sync with SlotPicker on detail page */
export const SLOT_WINDOW_LABELS: Record<RestSlot, string> = {
  "00-12": "00:00 – 12:00",
  "12-24": "12:00 – 24:00",
  "24h": "Full 24 hours",
};

export function getSlotWindowLabel(slot: RestSlot, language: AppLanguage = "en"): string {
  if (slot === "24h") return translate(language, "common.full24");
  return SLOT_WINDOW_LABELS[slot];
}

export const PAYMENT_METHODS: {
  id: PaymentMethod;
  labelKey: string;
  descriptionKey: string;
}[] = [
  {
    id: "card",
    labelKey: "checkout.card",
    descriptionKey: "checkout.cardDesc",
  },
  {
    id: "upi",
    labelKey: "checkout.upi",
    descriptionKey: "checkout.upiDesc",
  },
];

export const CARD_NETWORK_BADGES = ["Visa", "Mastercard", "Amex", "JCB", "RuPay"] as const;

export const UPI_APP_HINTS = [
  { id: "gpay", label: "GPay" },
  { id: "phonepe", label: "PhonePe" },
  { id: "paytm", label: "Paytm" },
  { id: "bhim", label: "BHIM" },
] as const;

export const UPI_HANDLE_SUGGESTIONS = [
  "@oksbi",
  "@okhdfcbank",
  "@paytm",
  "@ybl",
  "@axl",
] as const;

export const CHECKOUT_STEPS: { id: 1 | 2 | 3; labelKey: string }[] = [
  { id: 1, labelKey: "checkout.customer" },
  { id: 2, labelKey: "checkout.payment" },
  { id: 3, labelKey: "checkout.confirmed" },
];
