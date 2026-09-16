import { useCallback, useMemo, useState } from "react";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { isValidE164, isValidEmail, toE164 } from "@/lib/phone/validation";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { TermsAcceptance } from "@/features/checkout/components/TermsAcceptance";
import { useCheckoutDraft } from "@/features/checkout/hooks/useCheckoutDraft";
import { FormAlert, FormField, FormMessage } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "../context/AuthProvider";
import { SIGNUP_REQUIRES_EMAIL } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { SignupFormValues } from "../types";
import { PhoneInput } from "./PhoneInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { OtpVerificationModal } from "./OtpVerificationModal";

export function SignupForm() {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { signup, verifyPhone, skipPhoneVerification, isLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  const { draft } = useCheckoutDraft();

  const validateSignupField = useCallback(
    (field: keyof SignupFormValues, values: SignupFormValues): string | undefined => {
      switch (field) {
        case "fullName":
          if (!values.fullName.trim()) return t("auth.err.nameRequired");
          if (values.fullName.trim().length < 2) return t("auth.err.nameShort");
          return undefined;
        case "email":
          if (SIGNUP_REQUIRES_EMAIL && !values.email.trim()) return t("auth.err.emailRequired");
          if (values.email.trim() && !isValidEmail(values.email)) return t("auth.err.emailInvalid");
          return undefined;
        case "phoneNumber":
          if (!values.phoneNumber.trim()) return t("auth.err.phoneRequired");
          if (!isValidE164(values.phoneCountryCode, values.phoneNumber)) {
            return t("auth.err.phoneInvalid");
          }
          return undefined;
        case "phoneCountryCode":
          return values.phoneCountryCode ? undefined : t("auth.err.countryRequired");
        case "password":
          if (!values.password) return t("auth.err.passwordRequired");
          if (values.password.length < 8) return t("auth.err.passwordMin");
          return undefined;
        case "termsAccepted":
          if (!values.termsAccepted) return t("auth.err.terms");
          return undefined;
        default:
          return undefined;
      }
    },
    [t]
  );

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

  const hotelName = draft?.hotelMeta?.name ?? t("auth.yourHotel");

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
          email_taken: t("auth.err.emailTaken"),
          phone_taken: t("auth.err.phoneTaken"),
          weak_password: t("auth.err.weakPassword"),
          network: t("auth.err.generic"),
          unknown: t("auth.err.generic"),
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
    [form, signup, redirectAfterAuth, t]
  );

  const handleOtpVerified = useCallback(async () => {
    redirectAfterAuth();
  }, [redirectAfterAuth]);

  return (
    <>
      {draft && (
        <Alert className="mb-4 border-brand/30 bg-brand/5">
          <AlertDescription>
            {t("auth.finishBooking", { hotel: hotelName })}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormField
          label={t("auth.fullName")}
          htmlFor="signup-name"
          error={form.touched.fullName ? form.errors.fullName : undefined}
        >
          <Input
            id="signup-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!(form.touched.fullName && form.errors.fullName)}
            value={form.values.fullName}
            onChange={(e) => form.handleChange("fullName", e.target.value)}
            onBlur={() => form.handleBlur("fullName")}
          />
        </FormField>

        <FormField
          label={t("auth.emailOptional")}
          htmlFor="signup-email"
          error={form.touched.email ? form.errors.email : undefined}
        >
          <Input
            id="signup-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!(form.touched.email && form.errors.email)}
            value={form.values.email}
            onChange={(e) => form.handleChange("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
          />
        </FormField>

        <FormField
          label={t("auth.phone")}
          error={form.touched.phoneNumber ? form.errors.phoneNumber : undefined}
        >
          <PhoneInput
            countryCode={form.values.phoneCountryCode}
            nationalNumber={form.values.phoneNumber}
            onCountryCodeChange={(v) => form.handleChange("phoneCountryCode", v)}
            onNationalNumberChange={(v) => form.handleChange("phoneNumber", v)}
            onBlur={() => form.handleBlur("phoneNumber")}
            error={form.errors.phoneNumber}
            touched={form.touched.phoneNumber}
          />
        </FormField>

        <FormField
          label={t("auth.password")}
          htmlFor="signup-password"
          error={form.touched.password ? form.errors.password : undefined}
        >
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!(form.touched.password && form.errors.password)}
            value={form.values.password}
            onChange={(e) => form.handleChange("password", e.target.value)}
            onBlur={() => form.handleBlur("password")}
          />
          <PasswordStrengthMeter password={form.values.password} />
        </FormField>

        <div>
          <TermsAcceptance
            checked={form.values.termsAccepted}
            onChange={(checked) => form.handleChange("termsAccepted", checked)}
          />
          <FormMessage error={form.touched.termsAccepted ? form.errors.termsAccepted : undefined} />
        </div>

        {submitError && <FormAlert message={submitError} />}

        <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? t("auth.creating") : t("auth.createAccount")}
        </Button>
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
