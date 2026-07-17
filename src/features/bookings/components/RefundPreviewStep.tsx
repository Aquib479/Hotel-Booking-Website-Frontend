import { FormAlert } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
        <Card>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-16 rounded-xl" />
          </CardContent>
        </Card>
      )}

      {error && (
        <FormAlert
          message={error}
          action={
            <Button type="button" variant="link" className="h-auto p-0" onClick={onRetry}>
              Try again
            </Button>
          }
        />
      )}

      {preview && !isLoading && <RefundBreakdownCard booking={booking} preview={preview} />}
    </div>
  );
}
