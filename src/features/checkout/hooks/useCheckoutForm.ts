import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone/constants";
import { isValidE164, isValidEmail } from "@/lib/phone/validation";
import type { GuestDetailsValues } from "../types";
import { useLanguage } from "@/context/LanguageContext";

const INITIAL_VALUES: GuestDetailsValues = {
  fullName: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  specialRequests: "",
};

function validateField(
  field: keyof GuestDetailsValues,
  values: GuestDetailsValues,
  t: (key: string) => string,
): string | undefined {
  switch (field) {
    case "fullName":
      if (!values.fullName.trim()) return t("checkout.err.fullName");
      if (values.fullName.trim().length < 2) return t("checkout.err.fullNameShort");
      return undefined;
    case "email":
      if (!values.email.trim()) return t("checkout.err.email");
      if (!isValidEmail(values.email)) return t("checkout.err.emailInvalid");
      return undefined;
    case "phoneNumber":
      if (!values.phoneNumber.trim()) return t("checkout.err.phone");
      if (!isValidE164(values.phoneCountryCode, values.phoneNumber)) {
        return t("checkout.err.phoneInvalid");
      }
      return undefined;
    case "phoneCountryCode":
      return values.phoneCountryCode ? undefined : t("checkout.err.country");
    case "specialRequests":
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(
  values: GuestDetailsValues,
  t: (key: string) => string,
): Partial<Record<keyof GuestDetailsValues, string>> {
  const errors: Partial<Record<keyof GuestDetailsValues, string>> = {};
  (Object.keys(values) as (keyof GuestDetailsValues)[]).forEach((key) => {
    const error = validateField(key, values, t);
    if (error) errors[key] = error;
  });
  return errors;
}

export function useCheckoutForm(initialValues?: Partial<GuestDetailsValues>) {
  const { t } = useLanguage();
  const [values, setValues] = useState<GuestDetailsValues>({
    ...INITIAL_VALUES,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof GuestDetailsValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof GuestDetailsValues, boolean>>>({});

  const handleChange = useCallback(
    (field: keyof GuestDetailsValues, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          setErrors((e) => ({ ...e, [field]: validateField(field, next, t) }));
        }
        return next;
      });
    },
    [touched, t]
  );

  const handleBlur = useCallback((field: keyof GuestDetailsValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setValues((prev) => {
      setErrors((e) => ({ ...e, [field]: validateField(field, prev, t) }));
      return prev;
    });
  }, [t]);

  const validateForm = useCallback(() => {
    const nextErrors = validateAll(values, t);
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      phoneCountryCode: true,
      phoneNumber: true,
      specialRequests: true,
    });
    return Object.keys(nextErrors).length === 0;
  }, [values, t]);

  const isValid = useMemo(() => Object.keys(validateAll(values, t)).length === 0, [values, t]);

  const e164Phone = `${values.phoneCountryCode}${values.phoneNumber.replace(/\D/g, "")}`;

  return {
    values,
    errors,
    touched,
    isValid,
    e164Phone,
    handleChange,
    handleBlur,
    validateForm,
  };
}
