import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  detectIdentifierType,
  isValidEmail,
  normalizePhoneIdentifier,
} from "@/lib/phone/validation";
import { FormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { requestPasswordReset } from "../api";
import { FORGOT_PASSWORD_CONFIRMATION } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { ForgotPasswordValues } from "../types";
import { AuthLayout } from "../components/AuthLayout";

const INITIAL: ForgotPasswordValues = { identifier: "" };

function validateField(
  field: keyof ForgotPasswordValues,
  values: ForgotPasswordValues
): string | undefined {
  if (field !== "identifier") return undefined;
  if (!values.identifier.trim()) return "Email or phone is required";
  const type = detectIdentifierType(values.identifier);
  if (type === "email" && !isValidEmail(values.identifier)) {
    return "Enter a valid email address";
  }
  if (type === "phone" && normalizePhoneIdentifier(values.identifier).length < 8) {
    return "Enter a valid phone number";
  }
  return undefined;
}

export function ForgotPasswordPage() {
  const { buildAuthPath } = useAuthRedirect();
  const form = useAuthForm(INITIAL, validateField);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.validateAll()) return;
      setIsLoading(true);
      try {
        await requestPasswordReset(form.values.identifier.trim());
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
            label="Email or phone number"
            htmlFor="forgot-identifier"
            error={form.touched.identifier ? form.errors.identifier : undefined}
          >
            <Input
              id="forgot-identifier"
              type="text"
              autoComplete="username"
              aria-invalid={!!(form.touched.identifier && form.errors.identifier)}
              value={form.values.identifier}
              onChange={(e) => form.handleChange("identifier", e.target.value)}
              onBlur={() => form.handleBlur("identifier")}
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
