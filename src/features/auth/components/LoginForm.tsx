import { useCallback, useMemo, useState } from "react";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { isValidE164, toE164 } from "@/lib/phone/validation";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
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

export function LoginForm() {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { login, isLoading } = useAuth();
  const { redirectAfterAuth } = useAuthRedirect();

  const validateLoginField = useCallback(
    (field: keyof LoginFormValues, values: LoginFormValues): string | undefined => {
      switch (field) {
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
          return undefined;
        case "rememberMe":
          return undefined;
        default:
          return undefined;
      }
    },
    [t]
  );

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
        setSubmitError(LOGIN_GENERIC_ERROR(t));
        return;
      }

      redirectAfterAuth();
    },
    [form, login, redirectAfterAuth, t]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
          showHelper={false}
        />
      </FormField>

      <FormField
        label={t("auth.password")}
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
          {t("auth.rememberMe")}
        </Label>
      </div>

      {submitError && <FormAlert message={submitError} />}

      <Button type="submit" variant="brand" size="lg" className="w-full" disabled={isLoading}>
        {isLoading ? t("auth.signingIn") : t("auth.login")}
      </Button>
    </form>
  );
}
