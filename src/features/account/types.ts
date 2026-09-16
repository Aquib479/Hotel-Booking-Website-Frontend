export type AccountSection = "profile" | "payment" | "notifications" | "danger";

export type PhoneVerificationStatus = "verified" | "pending" | "unverified";

export type GenderOption = "female" | "male" | "non_binary" | "prefer_not_to_say" | "";

export type LanguagePreference = "en" | "id" | "hi";

export type PriceDisplayMode = "total" | "per_night";

export interface NotificationPreferences {
  whatsappTransactional: boolean;
  whatsappPromotional: boolean;
  emailTransactional: boolean;
  emailPromotional: boolean;
}

export interface MemberProfileDetails {
  gender: GenderOption;
  country: string;
  city: string;
  language: LanguagePreference;
  priceDisplay: PriceDisplayMode;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  pendingEmail?: string;
  phoneE164: string;
  pendingPhoneE164?: string;
  phoneVerified: boolean;
  hasPassword: boolean;
  notifications: NotificationPreferences;
  member: MemberProfileDetails;
}

export interface SavedPaymentMethod {
  id: string;
  type: "card" | "ewallet";
  label: string;
  maskedIdentifier: string;
  expiry?: string;
  holderName?: string;
}

export type ProfileField = "fullName" | "email";
export type MemberProfileField = keyof MemberProfileDetails;
