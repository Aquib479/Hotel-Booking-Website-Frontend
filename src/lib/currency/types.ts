export type CurrencyCode = "USD" | "IDR" | "EUR" | "GBP" | "SGD" | "MYR" | "AUD";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

export const CURRENCIES: CurrencyOption[] = [
  { code: "USD", label: "US Dollar", symbol: "$" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "AUD", label: "Australian Dollar", symbol: "A$" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "GBP", label: "British Pound", symbol: "£" },
];

/** Static display rates relative to USD (wholesale base currency) */
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 15800,
  SGD: 1.34,
  MYR: 4.72,
  AUD: 1.55,
  EUR: 0.92,
  GBP: 0.79,
};
