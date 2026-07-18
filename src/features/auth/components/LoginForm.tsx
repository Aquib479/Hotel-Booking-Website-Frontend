import { useCallback, useMemo, useState } from "react";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { isValidE164, toE164 } from "@/lib/phone/validation";
import { useCurrency } from "@/context/CurrencyContext";
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
import { PhoneInput } from "./PhoneInput";

function validateLoginField(
  field: keyof LoginFormValues,
  values: LoginFormValues
): string | undefined {
  switch (field) {
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
      return undefined;
    case "rememberMe":
      return undefined;
    default:
      return undefined;
  }
}

export function LoginForm() {
  const { currency } = useCurrency();
  const { login, isLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();

  const initial = useMemo(
    (): LoginFormValues => ({
      phoneCountryCode: getDefaultPhoneCountryCode(currency),
      phoneNumber: "",
      password: "",
      rememberMe: false,
    }),
    [currency]
  );

  const form = useAuthForm(initial, validateLoginField);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);
      if (!form.validateAll()) return;

      const phone = toE164(form.values.phoneCountryCode, form.values.phoneNumber);
      const result = await login(phone, form.values.password, form.values.rememberMe);

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
