import type { AccountSection, LanguagePreference, PriceDisplayMode } from "./types";

export const ACCOUNT_SECTION_PARAM = "section";
export const DEFAULT_ACCOUNT_SECTION: AccountSection = "profile";

export const ACCOUNT_SECTIONS: { id: AccountSection; label: string }[] = [
  { id: "profile", label: "Profile & settings" },
  { id: "payment", label: "Payment methods" },
  { id: "notifications", label: "Notifications" },
];

/** v1: tokenized saved methods deferred until gateway confirms capability */
export const SAVED_PAYMENT_METHODS_ENABLED = true;

/** Currency preference is display-only; checkout uses gateway settlement currency */
export const CURRENCY_IS_DISPLAY_ONLY = true;

export const CURRENCY_HELPER_TEXT =
  "This changes how prices are displayed. You'll always be charged in the currency shown at checkout.";

export const LANGUAGE_OPTIONS: { value: LanguagePreference; label: string }[] = [
  { value: "en", label: "English" },
  { value: "id", label: "Bahasa Indonesia" },
  { value: "hi", label: "Hindi" },
];

export const PRICE_DISPLAY_OPTIONS: { value: PriceDisplayMode; label: string; hint: string }[] = [
  { value: "total", label: "Total price", hint: "Show the full stay or slot total" },
  { value: "per_night", label: "Per night / per slot", hint: "Break down by night or rest slot" },
];

export const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non_binary", label: "Non-binary" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const COUNTRY_OPTIONS = [
  "Indonesia",
  "India",
  "Singapore",
  "Malaysia",
  "Thailand",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Other",
] as const;

export const DELETE_ACCOUNT_CONFIRM_TEXT = "DELETE";

export const DELETE_ACCOUNT_COPY = {
  title: "Delete account",
  body: "Deleting your account removes your profile and login access. Your booking history is retained for legal and financial records — upcoming bookings are not automatically cancelled.",
  confirmLabel: "Type DELETE to confirm",
};

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  whatsappTransactional: true,
  whatsappPromotional: false,
  emailTransactional: true,
  emailPromotional: false,
} as const;

export const DEFAULT_MEMBER_PROFILE = {
  gender: "" as const,
  country: "",
  city: "",
  language: "en" as const,
  priceDisplay: "total" as const,
};
