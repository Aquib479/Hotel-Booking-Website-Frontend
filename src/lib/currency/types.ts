export type CurrencyCode = "USD" | "IDR" | "EUR" | "GBP";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
];

/** Static display rates relative to USD (wholesale base currency) */
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 15800,
  EUR: 0.92,
  GBP: 0.79,
};
