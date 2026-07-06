import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency/format";
import { BOOKINGS_STATUS_PARAM } from "../constants";
import type { CancelBookingResult } from "../types";

interface CancelConfirmationStepProps {
  bookingId: string;
  hotelName: string;
  result: CancelBookingResult;
}

export function CancelConfirmationStep({
  bookingId,
  hotelName,
  result,
}: CancelConfirmationStepProps) {
  const isZeroRefund = result.refundAmount === 0;

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="size-8 text-emerald-600" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">Booking cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your booking at <span className="font-medium text-foreground">{hotelName}</span> has been
          cancelled.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 text-left text-sm">
        {!isZeroRefund ? (
          <>
            <p className="font-semibold text-foreground">
              Refund: {formatPrice(result.refundAmount, result.currency)}
            </p>
            <p className="mt-1 text-muted-foreground">{result.timelineText}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Cancellation is complete. Refund processing is separate — track progress on your
              booking detail page.
            </p>
          </>
        ) : (
          <p className="font-medium text-foreground">
            No refund applies. Your booking status is now cancelled.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          to={`/bookings?${BOOKINGS_STATUS_PARAM}=cancelled`}
          className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          View cancelled bookings
        </Link>
        <Link
          to={`/bookings/${bookingId}`}
          className="rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/50"
        >
          View booking details
        </Link>
      </div>
    </div>
  );
}
