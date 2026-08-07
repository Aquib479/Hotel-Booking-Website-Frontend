import type { BookingLane, SlotDuration } from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";
import {
  convertBetween,
  convertFromIdrPrecise,
  convertFromUsd,
  convertFromUsdPrecise,
  convertToUsd,
  getWholesaleGuestPriceUsd,
  roundForDisplay,
} from "@/lib/currency/format";
import type { CurrencyCode } from "./types";
import { CURRENCIES } from "./types";

export function toSupportedCurrency(code: string | undefined | null): CurrencyCode {
  const upper = (code || "USD").toUpperCase();
  return CURRENCIES.some((c) => c.code === upper) ? (upper as CurrencyCode) : "USD";
}

/**
 * Guest-facing amount in `currency`.
 * Prefer live API `priceAmount`+`priceCurrency` (no manual FX) when present.
 * RestHalf-direct still converts from IDR with local rates.
 */
export function getDisplayAmount(
  lane: BookingLane,
  priceUsd: number,
  priceIdr: number,
  currency: CurrencyCode,
  wholesaleQuote?: WholesaleQuote,
  priceAmount?: number,
  priceCurrency?: string
): number {
  if (
    priceAmount != null &&
    priceAmount > 0 &&
    priceCurrency &&
    (lane === "wholesale" || Boolean(priceCurrency))
  ) {
    const from = toSupportedCurrency(priceCurrency);
    if (from === currency) return roundForDisplay(priceAmount);
    // Mismatch should be rare after currency-scoped search; convert only as safety net.
    return convertBetween(priceAmount, from, currency);
  }

  if (lane === "direct") {
    if (currency === "IDR") return priceIdr;
    return roundForDisplay(convertFromIdrPrecise(priceIdr, currency));
  }

  const guestUsd = wholesaleQuote ? getWholesaleGuestPriceUsd(wholesaleQuote) : priceUsd;
  return roundForDisplay(convertFromUsdPrecise(guestUsd, currency));
}

/** Default budget max in the guest's selected currency (from USD reference). */
export function defaultPriceMaxForCurrency(currency: CurrencyCode): number {
  return convertFromUsd(1000, currency);
}

export function getPriceUnit(
  lane: BookingLane,
  mode: "rest" | "stay",
  slotDuration: SlotDuration = "12h"
): string {
  if (lane === "direct") {
    if (slotDuration === "24h") return "/ 24h slot";
    return mode === "rest" ? "/ 12h slot" : "/ 24h slot";
  }
  return "/ night";
}

/** Precise USD for direct 24h slot (Rest or one Stay night). */
export function getDirectSlotPriceUsd(priceUsd: number, priceIdr: number): number {
  return priceUsd || convertToUsd(priceIdr, "IDR");
}

export function getWholesaleNightlyUsd(
  priceUsd: number,
  wholesalePricing?: WholesaleQuote
): number {
  if (wholesalePricing) return getWholesaleGuestPriceUsd(wholesalePricing);
  return priceUsd;
}
