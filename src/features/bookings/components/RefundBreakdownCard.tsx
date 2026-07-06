import { formatPrice } from "@/lib/currency/format";
import { LaneBadge } from "@/components/common/LaneBadge";
import { cn } from "@/lib/utils";
import type { BookingDetail, RefundPreview } from "../types";

interface RefundBreakdownCardProps {
  booking: BookingDetail;
  preview: RefundPreview;
}

export function RefundBreakdownCard({ booking, preview }: RefundBreakdownCardProps) {
  const isZeroRefund = preview.refundAmount === 0;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        isZeroRefund ? "border-red-200 bg-red-50" : "border-border bg-white"
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{booking.hotelName}</p>
        <LaneBadge lane={booking.lane} />
      </div>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Amount paid</dt>
          <dd className="font-medium text-foreground">
            {formatPrice(preview.amountPaid, preview.currency)}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Refund per policy</dt>
          <dd className="text-right font-medium text-foreground">
            {preview.refundPercentage}% — {preview.policyExplanation}
          </dd>
        </div>

        {preview.nonRefundableAmount > 0 && (
          <div className="flex justify-between gap-4 border-t border-border pt-3">
            <dt className="text-muted-foreground">Non-refundable</dt>
            <dd className="text-right text-foreground">
              {formatPrice(preview.nonRefundableAmount, preview.currency)}
              {preview.nonRefundableNote && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {preview.nonRefundableNote}
                </span>
              )}
            </dd>
          </div>
        )}
      </dl>

      <div
        className={cn(
          "mt-5 rounded-xl px-4 py-4 text-center",
          isZeroRefund ? "bg-red-100" : "bg-brand/5"
        )}
      >
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          You will receive
        </p>
        <p
          className={cn(
            "mt-1 text-3xl font-bold",
            isZeroRefund ? "text-red-700" : "text-foreground"
          )}
        >
          {formatPrice(preview.refundAmount, preview.currency)}
        </p>
        {isZeroRefund && (
          <p className="mt-2 text-sm font-medium text-red-700">
            No refund applies for this cancellation.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{preview.timelineText}</p>
    </div>
  );
}
