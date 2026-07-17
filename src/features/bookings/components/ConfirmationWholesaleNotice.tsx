import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingDetail } from "../types";

interface ConfirmationWholesaleNoticeProps {
  booking: BookingDetail;
}

export function ConfirmationWholesaleNotice({ booking }: ConfirmationWholesaleNoticeProps) {
  if (booking.lane !== "wholesale") return null;

  return (
    <Card className="border-violet-200 bg-violet-50/50">
      <CardContent>
        <div className="flex gap-3">
          <Building2 className="size-5 shrink-0 text-violet-600" />
          <div className="min-w-0 text-sm">
            <h2 className="font-semibold text-foreground">Partner booking</h2>
            <p className="mt-1 text-muted-foreground">
              This stay was completed with{" "}
              <span className="font-medium text-foreground">
                {booking.supplierName ?? "our partner supplier"}
              </span>
              . The hotel has your guest details and will honor this booking directly.
            </p>

            <dl className="mt-4 space-y-2 rounded-xl border border-violet-200/80 bg-white/80 px-3 py-3">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">RestHalf reference</dt>
                <dd className="font-mono text-xs font-medium text-foreground">
                  {booking.confirmationCode}
                </dd>
              </div>
              {booking.payment.supplierBookingRef && (
                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <dt className="text-muted-foreground">Supplier reference</dt>
                  <dd className="font-mono text-xs font-medium text-foreground">
                    {booking.payment.supplierBookingRef}
                  </dd>
                </div>
              )}
            </dl>

            <p className="mt-3 text-xs text-muted-foreground">
              If you contact the hotel, quote the supplier reference above. RestHalf support can
              help with changes before check-in.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
