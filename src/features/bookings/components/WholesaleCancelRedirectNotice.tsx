import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { WHOLESALE_CANCEL_API_ENABLED } from "../constants";
import type { BookingDetail } from "../types";

interface WholesaleCancelRedirectNoticeProps {
  booking: BookingDetail;
}

export function WholesaleCancelRedirectNotice({ booking }: WholesaleCancelRedirectNoticeProps) {
  const supplier = booking.supplierName ?? "the partner supplier";

  return (
    <Alert>
      <AlertTitle>Cancellation via partner policy</AlertTitle>
      <AlertDescription>
        <p>
          This booking was made through {supplier}. RestHalf does not process cancellations directly
          for partner rates — the supplier&apos;s policy at time of booking applies.
        </p>
        <Button
          variant={WHOLESALE_CANCEL_API_ENABLED ? "brand" : "outline"}
          size="sm"
          className="mt-3"
          asChild
        >
          <Link to={`/bookings/${booking.id}/cancel`}>Request cancellation</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
