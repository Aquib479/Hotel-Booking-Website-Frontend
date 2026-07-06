import { useCallback, useMemo, useState } from "react";
import { DEFAULT_PHONE_COUNTRY_CODE } from "@/lib/phone/constants";
import { isValidE164, isValidEmail } from "@/lib/phone/validation";
import type { GuestDetailsValues } from "../types";

const INITIAL_VALUES: GuestDetailsValues = {
  fullName: "",
  email: "",
  phoneCountryCode: DEFAULT_PHONE_COUNTRY_CODE,
  phoneNumber: "",
  specialRequests: "",
};

function validateField(
  field: keyof GuestDetailsValues,
  values: GuestDetailsValues
): string | undefined {
  switch (field) {
    case "fullName":
      if (!values.fullName.trim()) return "Full name is required";
      if (values.fullName.trim().length < 2) return "Enter your full name";
      return undefined;
    case "email":
      if (!values.email.trim()) return "Email is required";
      if (!isValidEmail(values.email)) return "Enter a valid email address";
      return undefined;
    case "phoneNumber":
      if (!values.phoneNumber.trim()) return "Phone number is required";
      if (!isValidE164(values.phoneCountryCode, values.phoneNumber)) {
        return "Enter a valid phone number with country code";
      }
      return undefined;
    case "phoneCountryCode":
      return values.phoneCountryCode ? undefined : "Country code is required";
    case "specialRequests":
      return undefined;
    default:
      return undefined;
  }
}

function validateAll(values: GuestDetailsValues): Partial<Record<keyof GuestDetailsValues, string>> {
  const errors: Partial<Record<keyof GuestDetailsValues, string>> = {};
  (Object.keys(values) as (keyof GuestDetailsValues)[]).forEach((key) => {
    const error = validateField(key, values);
    if (error) errors[key] = error;
  });
  return errors;
}

export function useCheckoutForm(initialValues?: Partial<GuestDetailsValues>) {
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
          setErrors((e) => ({ ...e, [field]: validateField(field, next) }));
        }
        return next;
      });
    },
    [touched]
  );

  const handleBlur = useCallback((field: keyof GuestDetailsValues) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setValues((prev) => {
      setErrors((e) => ({ ...e, [field]: validateField(field, prev) }));
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({
      fullName: true,
      email: true,
      phoneCountryCode: true,
      phoneNumber: true,
      specialRequests: true,
    });
    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const isValid = useMemo(() => Object.keys(validateAll(values)).length === 0, [values]);

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
