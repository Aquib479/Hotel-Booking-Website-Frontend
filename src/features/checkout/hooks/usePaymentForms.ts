import { useCallback, useMemo, useState } from "react";
import type { CardPaymentValues, UpiPaymentValues } from "../types";
import { useLanguage } from "@/context/LanguageContext";

const INITIAL_CARD: CardPaymentValues = {
  holderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const INITIAL_UPI: UpiPaymentValues = {
  vpa: "",
};

export function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function detectCardBrand(cardNumber: string): "visa" | "mastercard" | "amex" | "rupay" | "jcb" | "unknown" {
  const digits = cardNumber.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(0|5)/.test(digits) || /^81[6-9]/.test(digits) || /^82[0-9]/.test(digits)) return "rupay";
  if (/^35/.test(digits)) return "jcb";
  return "unknown";
}

function luhnValid(digits: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validateCardField(
  field: keyof CardPaymentValues,
  values: CardPaymentValues,
  t: (key: string, vars?: Record<string, string | number>) => string,
): string | undefined {
  switch (field) {
    case "holderName": {
      if (!values.holderName.trim()) return t("checkout.err.holder");
      if (values.holderName.trim().length < 2) return t("checkout.err.holderShort");
      return undefined;
    }
    case "cardNumber": {
      const digits = values.cardNumber.replace(/\D/g, "");
      if (!digits) return t("checkout.err.card");
      const brand = detectCardBrand(digits);
      const expected = brand === "amex" ? 15 : digits.length >= 13 && digits.length <= 19;
      if (brand === "amex" ? digits.length !== 15 : !expected || digits.length < 13) {
        return t("checkout.err.cardInvalid");
      }
      if (!luhnValid(digits)) return t("checkout.err.cardInvalid");
      return undefined;
    }
    case "expiry": {
      if (!/^\d{2}\/\d{2}$/.test(values.expiry)) return t("checkout.err.mmyy");
      const [mm, yy] = values.expiry.split("/").map(Number);
      if (mm < 1 || mm > 12) return t("checkout.err.month");
      const now = new Date();
      const exp = new Date(2000 + yy, mm);
      if (exp <= now) return t("checkout.err.expired");
      return undefined;
    }
    case "cvv": {
      const digits = values.cvv.replace(/\D/g, "");
      const brand = detectCardBrand(values.cardNumber);
      const len = brand === "amex" ? 4 : 3;
      if (digits.length !== len) return t("checkout.err.cvv", { n: len });
      return undefined;
    }
    default:
      return undefined;
  }
}

function validateAllCard(
  values: CardPaymentValues,
  t: (key: string, vars?: Record<string, string | number>) => string,
) {
  const errors: Partial<Record<keyof CardPaymentValues, string>> = {};
  (Object.keys(values) as (keyof CardPaymentValues)[]).forEach((key) => {
    const error = validateCardField(key, values, t);
    if (error) errors[key] = error;
  });
  return errors;
}

export function useCardPaymentForm(initial?: Partial<CardPaymentValues>) {
  const { t } = useLanguage();
  const [values, setValues] = useState<CardPaymentValues>({ ...INITIAL_CARD, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof CardPaymentValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CardPaymentValues, boolean>>>({});
  const [focusedField, setFocusedField] = useState<keyof CardPaymentValues | null>(null);

  const handleChange = useCallback(
    (field: keyof CardPaymentValues, raw: string) => {
      let value = raw;
      if (field === "cardNumber") value = formatCardNumber(raw);
      if (field === "expiry") value = formatExpiry(raw);
      if (field === "cvv") value = raw.replace(/\D/g, "").slice(0, 4);
      if (field === "holderName") value = raw.slice(0, 40);

      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          setErrors((e) => ({ ...e, [field]: validateCardField(field, next, t) }));
        }
        return next;
      });
    },
    [touched, t]
  );

  const handleBlur = useCallback((field: keyof CardPaymentValues) => {
    setFocusedField(null);
    setTouched((prev) => ({ ...prev, [field]: true }));
    setValues((prev) => {
      setErrors((e) => ({ ...e, [field]: validateCardField(field, prev, t) }));
      return prev;
    });
  }, [t]);

  const handleFocus = useCallback((field: keyof CardPaymentValues) => {
    setFocusedField(field);
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors = validateAllCard(values, t);
    setErrors(nextErrors);
    setTouched({ holderName: true, cardNumber: true, expiry: true, cvv: true });
    return Object.keys(nextErrors).length === 0;
  }, [values, t]);

  const isValid = useMemo(() => Object.keys(validateAllCard(values, t)).length === 0, [values, t]);
  const brand = useMemo(() => detectCardBrand(values.cardNumber), [values.cardNumber]);

  return {
    values,
    errors,
    touched,
    focusedField,
    brand,
    isValid,
    handleChange,
    handleBlur,
    handleFocus,
    validateForm,
  };
}

function validateVpa(
  vpa: string,
  t: (key: string) => string,
): string | undefined {
  const trimmed = vpa.trim();
  if (!trimmed) return t("checkout.err.upi");
  if (!/^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(trimmed)) {
    return t("checkout.err.upiInvalid");
  }
  return undefined;
}

export function useUpiPaymentForm(initial?: Partial<UpiPaymentValues>) {
  const { t } = useLanguage();
  const [values, setValues] = useState<UpiPaymentValues>({ ...INITIAL_UPI, ...initial });
  const [errors, setErrors] = useState<Partial<Record<keyof UpiPaymentValues, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof UpiPaymentValues, boolean>>>({});

  const handleChange = useCallback(
    (field: keyof UpiPaymentValues, value: string) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value.trimStart().toLowerCase() };
        if (touched[field]) {
          setErrors((e) => ({ ...e, [field]: validateVpa(next.vpa, t) }));
        }
        return next;
      });
    },
    [touched, t]
  );

  const handleBlur = useCallback((field: keyof UpiPaymentValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setValues((prev) => {
      setErrors((e) => ({ ...e, [field]: validateVpa(prev.vpa, t) }));
      return prev;
    });
  }, [t]);

  const appendHandle = useCallback((handle: string) => {
    setValues((prev) => {
      const local = prev.vpa.includes("@") ? prev.vpa.split("@")[0] : prev.vpa;
      const next = { vpa: `${local.replace(/\s/g, "")}${handle}` };
      setTouched((prevTouched) => ({ ...prevTouched, vpa: true }));
      setErrors((e) => ({ ...e, vpa: validateVpa(next.vpa, t) }));
      return next;
    });
  }, [t]);

  const validateForm = useCallback(() => {
    const error = validateVpa(values.vpa, t);
    setErrors(error ? { vpa: error } : {});
    setTouched({ vpa: true });
    return !error;
  }, [values.vpa, t]);

  const isValid = useMemo(() => !validateVpa(values.vpa, t), [values.vpa, t]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    appendHandle,
    validateForm,
  };
}
