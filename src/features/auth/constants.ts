/** Product defaults — adjust when backend policy is finalized */
export const AUTH_STORAGE_KEY = "resthalf-auth-user";
export const AUTH_TOKEN_KEY = "resthalf-auth-token";
export const AUTH_REDIRECT_PARAM = "redirect";
export const AUTH_FROM_BOOKING_PARAM = "fromBooking";

/** OTP can be skipped at signup; WhatsApp notifications blocked until verified */
export const OTP_VERIFICATION_DEFERRABLE = true;

/** Guest checkout does not create a shadow account in v1 */
export const GUEST_CREATES_SHADOW_ACCOUNT = false;

/** v1: Google not wired to API yet */
export const SOCIAL_AUTH_ENABLED = false;

/** Phone is required for signup/login; email is optional */
export const SIGNUP_REQUIRES_EMAIL = false;

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

type Translate = (key: string) => string;

export const LOGIN_GENERIC_ERROR = (t: Translate) => t("auth.loginError");
export const FORGOT_PASSWORD_CONFIRMATION = (t: Translate) => t("auth.resetSent");
export const AUTH_BRAND_HEADLINE = (t: Translate) => t("auth.headline");
export const AUTH_BRAND_SUBLINE = (t: Translate) => t("auth.subline");

export const AUTH_HERO_IMAGE =
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1176&auto=format&fit=crop";
