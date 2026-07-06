/** Product defaults — adjust when backend policy is finalized */
export const AUTH_STORAGE_KEY = "resthalf-auth-user";
export const AUTH_REDIRECT_PARAM = "redirect";
export const AUTH_FROM_BOOKING_PARAM = "fromBooking";

/** OTP can be skipped at signup; WhatsApp notifications blocked until verified */
export const OTP_VERIFICATION_DEFERRABLE = true;

/** Guest checkout does not create a shadow account in v1 */
export const GUEST_CREATES_SHADOW_ACCOUNT = false;

/** v1: Google stub only; set false to hide social buttons entirely */
export const SOCIAL_AUTH_ENABLED = true;

/** Signup requires email; login accepts email or phone */
export const SIGNUP_REQUIRES_EMAIL = true;

export const OTP_LENGTH = 6;
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

export const LOGIN_GENERIC_ERROR = "Email/phone or password is incorrect";
export const FORGOT_PASSWORD_CONFIRMATION =
  "If an account exists, we've sent reset instructions to your email or phone.";

export const AUTH_BRAND_HEADLINE = "Book by the hour, not the night";
export const AUTH_BRAND_SUBLINE =
  "12-hour rest slots and overnight stays at airport hotels worldwide.";

export const AUTH_HERO_IMAGE =
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1176&auto=format&fit=crop";
