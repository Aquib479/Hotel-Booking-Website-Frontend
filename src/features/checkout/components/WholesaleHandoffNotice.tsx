import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface WholesaleHandoffNoticeProps {
  supplierName?: string;
  onContinue: () => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
}

export function WholesaleHandoffNotice({
  supplierName,
  onContinue,
  isSubmitting,
  disabled,
  disabledReason,
}: WholesaleHandoffNoticeProps) {
  const partner = supplierName ?? "our partner";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Partner booking</h2>
        <p className="text-sm text-muted-foreground">
          Payment is completed with the hotel supplier
        </p>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex gap-3">
          <ExternalLink className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">
              You&apos;ll complete this booking with {partner}
            </p>
            <p className="mt-2">
              Your details and price are locked in — you won&apos;t need to search again.
              RestHalf hands off to the supplier to finalize payment and confirmation.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={disabled || isSubmitting}
        title={disabled ? disabledReason : undefined}
        className={cn(
          "hidden h-12 w-full rounded-xl bg-brand text-base font-semibold text-white transition-opacity hover:bg-brand/90 lg:block",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {isSubmitting ? "Preparing handoff…" : "Continue to complete booking"}
      </button>
    </div>
  );
}
