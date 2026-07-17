import { useCallback, useState } from "react";
import {
  detectIdentifierType,
  isValidEmail,
  normalizePhoneIdentifier,
} from "@/lib/phone/validation";
import { FormAlert, FormField } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthProvider";
import { LOGIN_GENERIC_ERROR } from "../constants";
import { useAuthForm } from "../hooks/useAuthForm";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { LoginFormValues } from "../types";
import { ForgotPasswordLink } from "./ForgotPasswordLink";

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
      <FormField
        label="Email or phone number"
        htmlFor="login-identifier"
        error={form.touched.identifier ? form.errors.identifier : undefined}
      >
        <Input
          id="login-identifier"
          type="text"
          autoComplete="username"
          aria-invalid={!!(form.touched.identifier && form.errors.identifier)}
          value={form.values.identifier}
          onChange={(e) => form.handleChange("identifier", e.target.value)}
          onBlur={() => form.handleBlur("identifier")}
        />
      </FormField>

      <FormField
        label="Password"
        htmlFor="login-password"
        error={form.touched.password ? form.errors.password : undefined}
      >
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!(form.touched.password && form.errors.password)}
          value={form.values.password}
          onChange={(e) => form.handleChange("password", e.target.value)}
          onBlur={() => form.handleBlur("password")}
        />
        <ForgotPasswordLink />
      </FormField>

      <div className="flex items-center gap-2">
        <Checkbox
          id="login-remember"
          checked={form.values.rememberMe}
          onCheckedChange={(checked) => form.handleChange("rememberMe", checked === true)}
        />
        <Label htmlFor="login-remember" className="font-normal text-muted-foreground">
          Remember me
        </Label>
      </div>

      {submitError && <FormAlert message={submitError} />}

      <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in…" : "Log in"}
      </Button>
    </form>
  );
}
