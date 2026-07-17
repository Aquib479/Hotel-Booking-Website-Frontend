import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

      <Card className="bg-muted/30 text-left">
        <CardContent className="text-sm">
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
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="brand" asChild>
          <Link to={`/bookings?${BOOKINGS_STATUS_PARAM}=cancelled`}>View cancelled bookings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/bookings/${bookingId}`}>View booking details</Link>
        </Button>
      </div>
    </div>
  );
}
