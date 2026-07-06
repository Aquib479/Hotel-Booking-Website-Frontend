import { formatPrice } from "@/lib/currency/format";
import { cn } from "@/lib/utils";
import { REFUND_TIMELINE_TEXT } from "../constants";
import type { BookingRefundInfo } from "../types";

interface RefundStatusTrackerProps {
  refund: BookingRefundInfo;
}

const STEPS: { id: BookingRefundInfo["currentStep"]; label: string }[] = [
  { id: "requested", label: "Requested" },
  { id: "processing", label: "Processing" },
  { id: "refunded", label: "Refunded" },
];

function stepIndex(step: BookingRefundInfo["currentStep"]): number {
  if (step === "refunded") return 2;
  if (step === "processing") return 1;
  return 0;
}

export function RefundStatusTracker({ refund }: RefundStatusTrackerProps) {
  const active = stepIndex(refund.currentStep);
  const showPartial =
    refund.refundAmount !== undefined && refund.refundAmount < refund.originalAmount;

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h2 className="text-sm font-semibold text-foreground">Refund status</h2>

      <ol className="mt-4 flex items-center gap-2">
        {STEPS.map((step, i) => (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                  i <= active ? "bg-brand text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {i + 1}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn("mb-4 h-0.5 flex-1", i < active ? "bg-brand" : "bg-muted")}
                aria-hidden
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-4 space-y-1 text-sm">
        {refund.refundAmount !== undefined && (
          <p className="font-semibold text-foreground">
            Refund amount: {formatPrice(refund.refundAmount, refund.currency)}
          </p>
        )}
        {showPartial && (
          <p className="text-muted-foreground">
            Original paid: {formatPrice(refund.originalAmount, refund.currency)}
            {refund.partialReason && ` — ${refund.partialReason}`}
          </p>
        )}
        <p className="text-xs text-muted-foreground">{REFUND_TIMELINE_TEXT}</p>
      </div>
    </section>
  );
}
