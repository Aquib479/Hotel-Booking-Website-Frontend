import type { CurrencyCode } from "./types";
import { EXCHANGE_RATES } from "./types";

export interface WholesaleQuote {
  supplierBaseAmount: number;
  supplierCurrency: CurrencyCode;
  /** Markup rate applied after FX normalization, e.g. 0.12 = 12% */
  markupRate: number;
}

/** Convert any supported currency amount into USD — precise, no rounding. */
export function convertToUsd(amount: number, currency: CurrencyCode): number {
  return amount / EXCHANGE_RATES[currency];
}

/** Precise FX conversion from USD — use for chaining, not display. */
export function convertFromUsdPrecise(amountUsd: number, currency: CurrencyCode): number {
  return amountUsd * EXCHANGE_RATES[currency];
}

/** Single rounding point for guest-facing amounts (UI formats with 0 decimals). */
export function roundForDisplay(amount: number): number {
  return Math.round(amount);
}

/** Display/settlement conversion: precise FX, round once at the end. */
export function convertFromUsd(amountUsd: number, currency: CurrencyCode): number {
  return roundForDisplay(convertFromUsdPrecise(amountUsd, currency));
}

export function convertFromIdrPrecise(amountIdr: number, currency: CurrencyCode): number {
  return convertFromUsdPrecise(amountIdr / EXCHANGE_RATES.IDR, currency);
}

export function convertFromIdr(amountIdr: number, currency: CurrencyCode): number {
  return roundForDisplay(convertFromIdrPrecise(amountIdr, currency));
}

export function convertBetween(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;
  return convertFromUsd(convertToUsd(amount, from), to);
}

/**
 * Guest USD after FX → markup. Kept precise; round only when converting to display currency.
 */
export function getWholesaleGuestPriceUsd(quote: WholesaleQuote): number {
  const baseUsd = convertToUsd(quote.supplierBaseAmount, quote.supplierCurrency);
  return baseUsd * (1 + quote.markupRate);
}

/** Rounded USD for sorting/filtering comparisons only. */
export function getWholesaleGuestPriceUsdRounded(quote: WholesaleQuote): number {
  return roundForDisplay(getWholesaleGuestPriceUsd(quote));
}

export function formatPrice(
  amount: number,
  currency: CurrencyCode,
  options?: { compact?: boolean }
): string {
  const isIdr = currency === "IDR";
  const isInr = currency === "INR";
  const isVnd = currency === "VND";
  const isJpy = currency === "JPY";
  const isKrw = currency === "KRW";
  const displayAmount = roundForDisplay(amount);

  if (options?.compact && isIdr && displayAmount >= 1_000_000) {
    return `Rp ${(displayAmount / 1_000_000).toFixed(1)}M`;
  }
  if (options?.compact && isInr && displayAmount >= 100_000) {
    return `₹ ${(displayAmount / 100_000).toFixed(1)}L`;
  }

  const locale = isIdr
    ? "id-ID"
    : isInr
      ? "en-IN"
      : isVnd
        ? "vi-VN"
        : isJpy
          ? "ja-JP"
          : isKrw
            ? "ko-KR"
            : "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(displayAmount);
  } catch {
    const symbol = currency;
    return `${symbol} ${displayAmount.toLocaleString("en-US")}`;
  }
}
