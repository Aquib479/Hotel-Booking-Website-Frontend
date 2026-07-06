export type AccountSection = "profile" | "payment" | "notifications" | "danger";

export type PhoneVerificationStatus = "verified" | "pending" | "unverified";

export interface NotificationPreferences {
  whatsappTransactional: boolean;
  whatsappPromotional: boolean;
  emailTransactional: boolean;
  emailPromotional: boolean;
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
}

export interface SavedPaymentMethod {
  id: string;
  type: "card" | "ewallet";
  label: string;
  maskedIdentifier: string;
  expiry?: string;
  isDefault: boolean;
}

export type ProfileField = "fullName" | "email";
