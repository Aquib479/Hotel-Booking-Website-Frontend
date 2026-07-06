import type { CurrencyCode } from "@/lib/currency/types";

type PhoneCountryEntry = {
  code: string;
  label: string;
  currencies?: CurrencyCode[];
};

export const PHONE_COUNTRY_CODES: PhoneCountryEntry[] = [
  { code: "+62", label: "Indonesia (+62)", currencies: ["IDR"] },
  { code: "+971", label: "UAE (+971)", currencies: ["USD"] },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+91", label: "India (+91)", currencies: ["USD"] },
  { code: "+44", label: "UK (+44)", currencies: ["GBP", "EUR"] },
  { code: "+1", label: "US / Canada (+1)", currencies: ["USD"] },
  { code: "+81", label: "Japan (+81)", currencies: ["USD"] },
  { code: "+60", label: "Malaysia (+60)" },
  { code: "+61", label: "Australia (+61)" },
];

export const DEFAULT_PHONE_COUNTRY_CODE = "+62";

export function getDefaultPhoneCountryCode(currency?: CurrencyCode): string {
  if (!currency) return DEFAULT_PHONE_COUNTRY_CODE;
  const match = PHONE_COUNTRY_CODES.find((c) => c.currencies?.includes(currency));
  return match?.code ?? DEFAULT_PHONE_COUNTRY_CODE;
}
