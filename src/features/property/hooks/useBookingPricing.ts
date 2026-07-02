import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import type { BookingLane, SlotDuration } from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";
import { roundForDisplay } from "@/lib/currency/format";
import {
  getDirectSlotPriceUsd,
  getWholesaleNightlyUsd,
} from "@/lib/currency/pricing";
import type { BookingState, PriceBreakdown } from "../types";

const TAX_RATE = 0.11;

export function useBookingPricing(
  lane: BookingLane,
  priceUsd: number,
  priceIdr: number,
  booking: Pick<BookingState, "mode" | "checkIn" | "checkOut">,
  wholesalePricing?: WholesaleQuote,
  slotDuration: SlotDuration = "12h"
): PriceBreakdown {
  return useMemo(() => {
    const isDirectRest =
      lane === "direct" && (booking.mode === "rest" || slotDuration === "12h");

    if (isDirectRest) {
      const subtotalPrecise = getDirectSlotPriceUsd(priceUsd, priceIdr);
      const subtotal = roundForDisplay(subtotalPrecise);
      const tax = roundForDisplay(subtotalPrecise * TAX_RATE);
      return {
        nights: 1,
        subtotal,
        tax,
        totalDue: subtotal + tax,
        label: "Slot price",
      };
    }

    const nights =
      booking.checkIn && booking.checkOut
        ? Math.max(1, differenceInDays(booking.checkOut, booking.checkIn))
        : 1;

    const nightlyUsdPrecise =
      lane === "direct"
        ? getDirectSlotPriceUsd(priceUsd, priceIdr)
        : getWholesaleNightlyUsd(priceUsd, wholesalePricing);

    const subtotalPrecise = nightlyUsdPrecise * nights;
    const subtotal = roundForDisplay(subtotalPrecise);
    const tax = roundForDisplay(subtotalPrecise * TAX_RATE);

    return {
      nights,
      subtotal,
      tax,
      totalDue: subtotal + tax,
      label: lane === "direct" ? "24h slot × nights" : "Room rate",
    };
  }, [
    booking.checkIn,
    booking.checkOut,
    booking.mode,
    lane,
    priceIdr,
    priceUsd,
    slotDuration,
    wholesalePricing,
  ]);
}
