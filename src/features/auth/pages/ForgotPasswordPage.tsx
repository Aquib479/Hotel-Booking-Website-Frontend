import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  detectIdentifierType,
  isValidEmail,
  normalizePhoneIdentifier,
} from "@/lib/phone/validation";
import { requestPasswordReset } from "../api";
import { FORGOT_PASSWORD_CONFIRMATION } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { ForgotPasswordValues } from "../types";
import { AuthLayout } from "../components/AuthLayout";

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

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
          <p className="rounded-xl border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-foreground">
            {FORGOT_PASSWORD_CONFIRMATION}
          </p>
          <Link
            to={buildAuthPath("/login")}
            className="inline-block text-sm font-medium text-brand hover:underline"
          >
            Back to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Email or phone number
            </label>
            <input
              type="text"
              autoComplete="username"
              value={form.values.identifier}
              onChange={(e) => form.handleChange("identifier", e.target.value)}
              onBlur={() => form.handleBlur("identifier")}
              className={cn(
                inputClass,
                form.touched.identifier && form.errors.identifier && "border-red-400"
              )}
            />
            {form.touched.identifier && form.errors.identifier && (
              <p className="mt-1 text-xs text-red-600">{form.errors.identifier}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Sending…" : "Send reset instructions"}
          </button>

          <Link
            to={buildAuthPath("/login")}
            className="block text-center text-sm font-medium text-brand hover:underline"
          >
            Back to log in
          </Link>
        </form>
      )}
    </AuthLayout>
  );
}
