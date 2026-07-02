import type { BookingLane, SlotDuration } from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";
import {
  convertFromIdrPrecise,
  convertFromUsdPrecise,
  convertToUsd,
  getWholesaleGuestPriceUsd,
  roundForDisplay,
} from "@/lib/currency/format";
import type { CurrencyCode } from "./types";

export function getDisplayAmount(
  lane: BookingLane,
  priceUsd: number,
  priceIdr: number,
  currency: CurrencyCode,
  wholesaleQuote?: WholesaleQuote
): number {
  if (lane === "direct") {
    if (currency === "IDR") return priceIdr;
    return roundForDisplay(convertFromIdrPrecise(priceIdr, currency));
  }

  const guestUsd = wholesaleQuote ? getWholesaleGuestPriceUsd(wholesaleQuote) : priceUsd;
  return roundForDisplay(convertFromUsdPrecise(guestUsd, currency));
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
