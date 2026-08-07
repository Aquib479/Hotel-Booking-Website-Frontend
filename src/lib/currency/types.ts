export type CurrencyCode =
  | "INR"
  | "EUR"
  | "USD"
  | "AED"
  | "AZN"
  | "AUD"
  | "BHD"
  | "BRL"
  | "BYN"
  | "CAD"
  | "CHF"
  | "CLP"
  | "CNY"
  | "COP"
  | "DKK"
  | "GBP"
  | "HKD"
  | "IDR"
  | "ILS"
  | "JOD"
  | "JPY"
  | "KRW"
  | "KWD"
  | "KZT"
  | "LAK"
  | "MNT"
  | "MOP"
  | "MXN"
  | "MYR"
  | "NZD"
  | "OMR"
  | "PHP"
  | "PKR"
  | "PLN"
  | "QAR"
  | "RUB"
  | "SAR"
  | "SEK"
  | "SGD"
  | "THB"
  | "TRY"
  | "TWD"
  | "VND"
  | "ZAR";

export interface CurrencyOption {
  code: CurrencyCode;
  label: string;
  symbol: string;
}

/** Featured currencies shown at the top of the picker */
export const FEATURED_CURRENCIES: CurrencyCode[] = ["INR", "EUR", "USD"];

export const CURRENCIES: CurrencyOption[] = [
  { code: "INR", label: "Indian Rupee", symbol: "₹" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "USD", label: "United States Dollar ($)", symbol: "$" },
  { code: "AED", label: "United Arab Emirates Dirham", symbol: "AED" },
  { code: "AZN", label: "Azerbaijani manat", symbol: "₼" },
  { code: "AUD", label: "Australian Dollar (AU$)", symbol: "A$" },
  { code: "BHD", label: "Bahraini Dinar", symbol: "BD" },
  { code: "BRL", label: "Brazilian Real", symbol: "R$" },
  { code: "BYN", label: "Belarusian ruble", symbol: "Br" },
  { code: "CAD", label: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", label: "Swiss Franc", symbol: "CHF" },
  { code: "CLP", label: "Chilean Peso", symbol: "CLP" },
  { code: "CNY", label: "Chinese Yuan", symbol: "¥" },
  { code: "COP", label: "Colombian Peso", symbol: "COP" },
  { code: "DKK", label: "Danish Krone", symbol: "kr" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" },
  { code: "HKD", label: "Hong Kong Dollar (HK$)", symbol: "HK$" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp" },
  { code: "ILS", label: "Israeli New Shekel", symbol: "₪" },
  { code: "JOD", label: "Jordanian Dinar", symbol: "JD" },
  { code: "JPY", label: "Japanese Yen", symbol: "¥" },
  { code: "KRW", label: "Korean Won (₩)", symbol: "₩" },
  { code: "KWD", label: "Kuwaiti Dinar", symbol: "KD" },
  { code: "KZT", label: "Kazakhstani tenge", symbol: "₸" },
  { code: "LAK", label: "Lao Kip", symbol: "₭" },
  { code: "MNT", label: "Mongolian Tugrik", symbol: "₮" },
  { code: "MOP", label: "Macau Pataca", symbol: "MOP$" },
  { code: "MXN", label: "Mexican Peso (Mex$)", symbol: "Mex$" },
  { code: "MYR", label: "Malaysian Ringgit", symbol: "RM" },
  { code: "NZD", label: "New Zealand Dollar", symbol: "NZ$" },
  { code: "OMR", label: "Omani Rial", symbol: "OMR" },
  { code: "PHP", label: "Philippine Peso", symbol: "₱" },
  { code: "PKR", label: "Pakistani Rupee", symbol: "Rs" },
  { code: "PLN", label: "Polish Zloty", symbol: "zł" },
  { code: "QAR", label: "Qatari Riyal", symbol: "QR" },
  { code: "RUB", label: "Russian Ruble", symbol: "₽" },
  { code: "SAR", label: "Saudi Riyal", symbol: "SAR" },
  { code: "SEK", label: "Swedish Krona", symbol: "kr" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$" },
  { code: "THB", label: "Thai Baht", symbol: "฿" },
  { code: "TRY", label: "Turkish Lira", symbol: "₺" },
  { code: "TWD", label: "New Taiwan Dollar", symbol: "NT$" },
  { code: "VND", label: "Vietnamese Dong", symbol: "₫" },
  { code: "ZAR", label: "South African Rand", symbol: "R" },
];

/** Static display rates relative to USD (approx.; for UI conversion only) */
export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
  AED: 3.67,
  AZN: 1.7,
  AUD: 1.55,
  BHD: 0.38,
  BRL: 5.1,
  BYN: 3.27,
  CAD: 1.36,
  CHF: 0.88,
  CLP: 950,
  CNY: 7.25,
  COP: 4100,
  DKK: 6.9,
  HKD: 7.8,
  IDR: 15800,
  ILS: 3.7,
  JOD: 0.71,
  JPY: 150,
  KRW: 1350,
  KWD: 0.31,
  KZT: 480,
  LAK: 21500,
  MNT: 3450,
  MOP: 8.05,
  MXN: 17.2,
  MYR: 4.72,
  NZD: 1.68,
  OMR: 0.38,
  PHP: 58,
  PKR: 278,
  PLN: 4.0,
  QAR: 3.64,
  RUB: 92,
  SAR: 3.75,
  SEK: 10.5,
  SGD: 1.34,
  THB: 36,
  TRY: 32,
  TWD: 32,
  VND: 25400,
  ZAR: 18.5,
};

export const DEFAULT_CURRENCY: CurrencyCode = "IDR";
