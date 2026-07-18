export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phoneE164: string;
  phoneVerified: boolean;
  createdAt: string;
  hasPassword?: boolean;
  pendingEmail?: string;
  pendingPhoneE164?: string;
};

export type LoginFormValues = {
  phoneCountryCode: string;
  phoneNumber: string;
  password: string;
  rememberMe: boolean;
};

export type SignupFormValues = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  password: string;
  termsAccepted: boolean;
};

export type ForgotPasswordValues = {
  phoneCountryCode: string;
  phoneNumber: string;
};

export type AuthTab = "login" | "signup";

export type AuthResult =
  | { success: true; user: AuthUser; token: string; needsPhoneVerification?: boolean }
  | { success: false; error: "invalid_credentials" | "network" | "unknown" };

export type SignupResult =
  | { success: true; user: AuthUser; token: string; needsPhoneVerification: boolean }
  | { success: false; error: "email_taken" | "phone_taken" | "weak_password" | "network" | "unknown" };

export type OtpVerificationState = {
  digits: string[];
  isVerifying: boolean;
  error: string | null;
  resendCooldownSeconds: number;
};
