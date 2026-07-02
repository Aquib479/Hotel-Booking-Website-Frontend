import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import type { BookingState, PriceBreakdown } from "../types";

const DEPOSIT = 500;
const DISCOUNT_THRESHOLD_NIGHTS = 5;
const DISCOUNT_RATE = 0.05;

export function useBookingPricing(
  pricePerNight: number,
  booking: BookingState
): PriceBreakdown {
  return useMemo(() => {
    const nights =
      booking.checkIn && booking.checkOut
        ? Math.max(1, differenceInDays(booking.checkOut, booking.checkIn))
        : 7;

    const rentalTotal = pricePerNight * nights;
    const discount =
      nights >= DISCOUNT_THRESHOLD_NIGHTS ? Math.round(rentalTotal * DISCOUNT_RATE) : 0;
    const totalDue = rentalTotal - discount + DEPOSIT;

    return { nights, rentalTotal, discount, deposit: DEPOSIT, totalDue };
  }, [booking.checkIn, booking.checkOut, pricePerNight]);
}
