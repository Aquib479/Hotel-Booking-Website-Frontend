import type { AccountSection } from "./types";

export const ACCOUNT_SECTION_PARAM = "section";
export const DEFAULT_ACCOUNT_SECTION: AccountSection = "profile";

export const ACCOUNT_SECTIONS: { id: AccountSection; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "payment", label: "Payment methods" },
  { id: "notifications", label: "Notifications" },
  { id: "danger", label: "Delete account" },
];

/** v1: tokenized saved methods deferred until gateway confirms capability */
export const SAVED_PAYMENT_METHODS_ENABLED = true;

/** Currency preference is display-only; checkout uses gateway settlement currency */
export const CURRENCY_IS_DISPLAY_ONLY = true;

export const CURRENCY_HELPER_TEXT =
  "This changes how prices are displayed. You'll always be charged in the currency shown at checkout.";

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
