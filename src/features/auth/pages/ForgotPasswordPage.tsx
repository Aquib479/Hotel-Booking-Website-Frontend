import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { isValidE164, toE164 } from "@/lib/phone/validation";
import { useCurrency } from "@/context/CurrencyContext";
import { FormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset } from "../api";
import { FORGOT_PASSWORD_CONFIRMATION } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { ForgotPasswordValues } from "../types";
import { AuthLayout } from "../components/AuthLayout";
import { PhoneInput } from "../components/PhoneInput";

function validateField(
  field: keyof ForgotPasswordValues,
  values: ForgotPasswordValues
): string | undefined {
  if (field === "phoneCountryCode") {
    return values.phoneCountryCode ? undefined : "Country code is required";
  }
  if (field !== "phoneNumber") return undefined;
  if (!values.phoneNumber.trim()) return "Phone number is required";
  if (!isValidE164(values.phoneCountryCode, values.phoneNumber)) {
    return "Enter a valid phone number with country code";
  }
  return undefined;
}

export function ForgotPasswordPage() {
  const { currency } = useCurrency();
  const { buildAuthPath } = useAuthRedirect();

  const initial = useMemo(
    (): ForgotPasswordValues => ({
      phoneCountryCode: getDefaultPhoneCountryCode(currency),
      phoneNumber: "",
    }),
    [currency]
  );

  const form = useAuthForm(initial, validateField);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.validateAll()) return;
      setIsLoading(true);
      try {
        const phone = toE164(form.values.phoneCountryCode, form.values.phoneNumber);
        await requestPasswordReset(phone);
        setSubmitted(true);
      } catch {
        setSubmitted(true);
      } finally {
        setIsLoading(false);
      }
    },
    [form]
  );

  return (
    <AuthLayout title="Reset your password" subtitle="We'll send instructions if an account exists">
      {submitted ? (
        <div className="space-y-4">
          <Alert className="border-brand/30 bg-brand/5">
            <AlertDescription>{FORGOT_PASSWORD_CONFIRMATION}</AlertDescription>
          </Alert>
          <Button variant="link" className="h-auto p-0" asChild>
            <Link to={buildAuthPath("/login")}>Back to log in</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormField
            label="Phone number"
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
              showHelper={false}
            />
          </FormField>

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending…" : "Send reset instructions"}
          </Button>

          <Button variant="link" className="w-full" asChild>
            <Link to={buildAuthPath("/login")}>Back to log in</Link>
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
