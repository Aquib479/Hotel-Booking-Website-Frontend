import { Loader2 } from "lucide-react";
import { getSlotWindowLabel } from "@/features/checkout/constants";
import { formatPrice } from "@/lib/currency/format";
import type { RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";
import { Button } from "@/components/ui/button";
import { CommissionBadge } from "./CommissionBadge";

interface WalkInBookingSummaryBarProps {
  roomLabel: string | null;
  slot: RestSlot | null;
  guestName: string;
  amount: number | null;
  currency: CurrencyCode;
  commissionAmount: number | null;
  canSubmit: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export function WalkInBookingSummaryBar({
  roomLabel,
  slot,
  guestName,
  amount,
  currency,
  commissionAmount,
  canSubmit,
  isSubmitting,
  onConfirm,
}: WalkInBookingSummaryBarProps) {
  return (
    <div className="sticky bottom-0 z-10 border-t bg-background shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-semibold">
            {roomLabel ?? "No room selected"}
            {slot && (
              <span className="font-normal text-muted-foreground">
                {" "}
                · {getSlotWindowLabel(slot)} · today
              </span>
            )}
          </p>
          <p className="truncate text-muted-foreground">
            {guestName.trim() || "Guest name required"}
            {amount !== null && (
              <span className="ml-2 font-bold text-foreground">{formatPrice(amount, currency)}</span>
            )}
          </p>
          {commissionAmount !== null && commissionAmount > 0 && (
            <CommissionBadge amount={commissionAmount} currency={currency} className="mt-2" />
          )}
        </div>

        <Button
          type="button"
          variant="brand"
          size="lg"
          disabled={!canSubmit || isSubmitting}
          onClick={onConfirm}
          className="shrink-0 px-8"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Confirming…
            </>
          ) : (
            "Confirm booking"
          )}
        </Button>
      </div>
    </div>
  );
}
