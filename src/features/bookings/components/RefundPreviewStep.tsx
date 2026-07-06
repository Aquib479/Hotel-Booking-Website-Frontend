import { RefundBreakdownCard } from "./RefundBreakdownCard";
import type { BookingDetail, RefundPreview } from "../types";

interface RefundPreviewStepProps {
  booking: BookingDetail;
  preview: RefundPreview | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function RefundPreviewStep({
  booking,
  preview,
  isLoading,
  error,
  onRetry,
}: RefundPreviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Your refund preview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review exactly what you&apos;ll get back before confirming cancellation.
        </p>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3 rounded-2xl border border-border p-5">
          <div className="h-4 w-1/2 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-16 rounded-xl bg-muted" />
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-medium text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {preview && !isLoading && <RefundBreakdownCard booking={booking} preview={preview} />}
    </div>
  );
}
