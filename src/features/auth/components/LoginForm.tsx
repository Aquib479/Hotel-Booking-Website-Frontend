import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import {
  detectIdentifierType,
  isValidEmail,
  normalizePhoneIdentifier,
} from "@/lib/phone/validation";
import { useAuth } from "../context/AuthProvider";
import { LOGIN_GENERIC_ERROR } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { LoginFormValues } from "../types";
import { ForgotPasswordLink } from "./ForgotPasswordLink";

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

const INITIAL: LoginFormValues = {
  identifier: "",
  password: "",
  rememberMe: false,
};

function validateLoginField(
  field: keyof LoginFormValues,
  values: LoginFormValues
): string | undefined {
  switch (field) {
    case "identifier": {
      if (!values.identifier.trim()) return "Email or phone is required";
      const type = detectIdentifierType(values.identifier);
      if (type === "email" && !isValidEmail(values.identifier)) {
        return "Enter a valid email address";
      }
      if (type === "phone" && normalizePhoneIdentifier(values.identifier).length < 8) {
        return "Enter a valid phone number";
      }
      if (type === "unknown" && !isValidEmail(values.identifier)) {
        return "Enter a valid email or phone number";
      }
      return undefined;
    }
    case "password":
      if (!values.password) return "Password is required";
      return undefined;
    case "rememberMe":
      return undefined;
    default:
      return undefined;
  }
}

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();
  const form = useAuthForm(INITIAL, validateLoginField);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!form.validateAll()) return;

      const result = await login(
        form.values.identifier.trim(),
        form.values.password,
        form.values.rememberMe
      );

      if (!result.success) {
        setSubmitError(LOGIN_GENERIC_ERROR);
        return;
      }

      redirectAfterAuth();
    },
    [form, login, redirectAfterAuth]
  );

  return (
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

      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Password</label>
        <input
          type="password"
          autoComplete="current-password"
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
        <ForgotPasswordLink />
      </div>

      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={form.values.rememberMe}
          onChange={(e) => form.handleChange("rememberMe", e.target.checked)}
          className="size-4 rounded border-border accent-brand"
        />
        <span className="text-sm text-muted-foreground">Remember me</span>
      </label>

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
        {isLoading ? "Signing in…" : "Log in"}
      </button>
    </form>
  );
}
