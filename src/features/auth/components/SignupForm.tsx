import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { isValidE164, isValidEmail, toE164 } from "@/lib/phone/validation";
import { useCurrency } from "@/context/CurrencyContext";
import { TermsAcceptance } from "@/features/checkout/components/TermsAcceptance";
import { useCheckoutDraft } from "@/features/checkout/hooks/useCheckoutDraft";
import { getPropertyById } from "@/features/property/data";
import { useAuth } from "../context/AuthProvider";
import { SIGNUP_REQUIRES_EMAIL } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { SignupFormValues } from "../types";
import { PhoneInput } from "./PhoneInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { OtpVerificationModal } from "./OtpVerificationModal";

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

function validateSignupField(
  field: keyof SignupFormValues,
  values: SignupFormValues
): string | undefined {
  switch (field) {
    case "fullName":
      if (!values.fullName.trim()) return "Full name is required";
      if (values.fullName.trim().length < 2) return "Enter your full name";
      return undefined;
    case "email":
      if (SIGNUP_REQUIRES_EMAIL && !values.email.trim()) return "Email is required";
      if (values.email.trim() && !isValidEmail(values.email)) return "Enter a valid email address";
      return undefined;
    case "phoneNumber":
      if (!values.phoneNumber.trim()) return "Phone number is required";
      if (!isValidE164(values.phoneCountryCode, values.phoneNumber)) {
        return "Enter a valid phone number with country code";
      }
      return undefined;
    case "phoneCountryCode":
      return values.phoneCountryCode ? undefined : "Country code is required";
    case "password":
      if (!values.password) return "Password is required";
      if (values.password.length < 8) return "Use at least 8 characters";
      return undefined;
    case "termsAccepted":
      if (!values.termsAccepted) return "You must accept the terms";
      return undefined;
    default:
      return undefined;
  }
}

export function SignupForm() {
  const { currency } = useCurrency();
  const { signup, verifyPhone, skipPhoneVerification, isLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  const { draft } = useCheckoutDraft();

  const initial = useMemo(
    (): SignupFormValues => ({
      fullName: "",
      email: "",
      phoneCountryCode: getDefaultPhoneCountryCode(currency),
      phoneNumber: "",
      password: "",
      termsAccepted: false,
    }),
    [currency]
  );

  const form = useAuthForm(initial, validateSignupField);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [signedUpPhone, setSignedUpPhone] = useState("");

  const property = draft ? getPropertyById(draft.propertyId) : null;
  const hotelName = property?.title ?? "your hotel";

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!form.validateAll()) return;

      const phoneE164 = toE164(form.values.phoneCountryCode, form.values.phoneNumber);
      const result = await signup({
        fullName: form.values.fullName.trim(),
        email: form.values.email.trim(),
        phoneE164,
        password: form.values.password,
      });

      if (!result.success) {
        const messages: Record<string, string> = {
          email_taken: "An account with this email already exists",
          phone_taken: "An account with this phone number already exists",
          weak_password: "Choose a stronger password (at least 8 characters)",
          network: "Something went wrong. Please try again.",
          unknown: "Something went wrong. Please try again.",
        };
        setSubmitError(messages[result.error] ?? messages.unknown);
        return;
      }

      if (result.needsPhoneVerification) {
        setSignedUpPhone(phoneE164);
        setShowOtp(true);
        return;
      }

      redirectAfterAuth();
    },
    [form, signup, redirectAfterAuth]
  );

  const handleOtpVerified = useCallback(async () => {
    redirectAfterAuth();
  }, [redirectAfterAuth]);

  return (
    <>
      {draft && property && (
        <div className="mb-4 rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-foreground">
          Create an account to finish booking <span className="font-semibold">{hotelName}</span>.
          Your booking details are saved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Full name</label>
          <input
            type="text"
            autoComplete="name"
            value={form.values.fullName}
            onChange={(e) => form.handleChange("fullName", e.target.value)}
            onBlur={() => form.handleBlur("fullName")}
            className={cn(
              inputClass,
              form.touched.fullName && form.errors.fullName && "border-red-400"
            )}
          />
          {form.touched.fullName && form.errors.fullName && (
            <p className="mt-1 text-xs text-red-600">{form.errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={form.values.email}
            onChange={(e) => form.handleChange("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
            className={cn(
              inputClass,
              form.touched.email && form.errors.email && "border-red-400"
            )}
          />
          {form.touched.email && form.errors.email && (
            <p className="mt-1 text-xs text-red-600">{form.errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Phone number</label>
          <PhoneInput
            countryCode={form.values.phoneCountryCode}
            nationalNumber={form.values.phoneNumber}
            onCountryCodeChange={(v) => form.handleChange("phoneCountryCode", v)}
            onNationalNumberChange={(v) => form.handleChange("phoneNumber", v)}
            onBlur={() => form.handleBlur("phoneNumber")}
            error={form.errors.phoneNumber}
            touched={form.touched.phoneNumber}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
          <input
            type="password"
            autoComplete="new-password"
            value={form.values.password}
            onChange={(e) => form.handleChange("password", e.target.value)}
            onBlur={() => form.handleBlur("password")}
            className={cn(
              inputClass,
              form.touched.password && form.errors.password && "border-red-400"
            )}
          />
          {form.touched.password && form.errors.password && (
            <p className="mt-1 text-xs text-red-600">{form.errors.password}</p>
          )}
          <PasswordStrengthMeter password={form.values.password} />
        </div>

        <div>
          <TermsAcceptance
            checked={form.values.termsAccepted}
            onChange={(checked) => form.handleChange("termsAccepted", checked)}
          />
          {form.touched.termsAccepted && form.errors.termsAccepted && (
            <p className="mt-1 text-xs text-red-600">{form.errors.termsAccepted}</p>
          )}
        </div>

        {submitError && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      {showOtp && (
        <OtpVerificationModal
          phoneE164={signedUpPhone}
          onVerified={handleOtpVerified}
          onSkip={() => {
            skipPhoneVerification();
            redirectAfterAuth();
          }}
          verify={verifyPhone}
        />
      )}
    </>
  );
}
