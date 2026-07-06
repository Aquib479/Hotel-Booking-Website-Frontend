import { Link } from "react-router-dom";
import { WHOLESALE_CANCEL_API_ENABLED } from "../constants";
import type { BookingDetail } from "../types";

interface WholesaleCancelRedirectNoticeProps {
  booking: BookingDetail;
}

export function WholesaleCancelRedirectNotice({ booking }: WholesaleCancelRedirectNoticeProps) {
  const supplier = booking.supplierName ?? "the partner supplier";

  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 text-sm">
      <p className="font-medium text-foreground">Cancellation via partner policy</p>
      <p className="mt-1 text-muted-foreground">
        This booking was made through {supplier}. RestHalf does not process cancellations directly
        for partner rates — the supplier&apos;s policy at time of booking applies.
      </p>
      {WHOLESALE_CANCEL_API_ENABLED ? (
        <Link
          to={`/bookings/${booking.id}/cancel`}
          className="mt-3 inline-block rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          Request cancellation
        </Link>
      ) : (
        <Link
          to={`/bookings/${booking.id}/cancel`}
          className="mt-3 inline-block rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/50"
        >
          Request cancellation
        </Link>
      )}
    </div>
  );
}
