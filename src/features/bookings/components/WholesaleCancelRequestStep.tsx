import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { FormField } from "@/components/common/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  CANCEL_REASONS,
  SUPPORT_CONTACT_HREF,
  WHOLESALE_CANCEL_RESPONSE_HOURS,
} from "../constants";
import type { BookingDetail, CancelReasonId } from "../types";

interface WholesaleCancelRequestStepProps {
  booking: BookingDetail;
  onSubmit: (reason: CancelReasonId, detail: string) => Promise<void>;
  isSubmitting: boolean;
  submittedRef?: string | null;
}

export function WholesaleCancelRequestStep({
  booking,
  onSubmit,
  isSubmitting,
  submittedRef,
}: WholesaleCancelRequestStepProps) {
  const [reason, setReason] = useState<CancelReasonId | null>(null);
  const [detail, setDetail] = useState("");

  if (submittedRef) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Request submitted</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ll process your cancellation with {booking.supplierName ?? "our partner"} and
          confirm within {WHOLESALE_CANCEL_RESPONSE_HOURS} hours.
        </p>
        <p className="font-mono text-sm text-foreground">Reference: {submittedRef}</p>
        <Button variant="brand" asChild>
          <Link to={`/bookings/${booking.id}`}>Back to booking</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Request cancellation</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Partner bookings are cancelled through our support team — this isn&apos;t instant.
        </p>
      </div>

      <Alert>
        <AlertDescription>
          {booking.hotelName} · Ref {booking.confirmationCode}
          {booking.payment.supplierBookingRef && (
            <span className="block font-mono text-xs">
              Supplier ref: {booking.payment.supplierBookingRef}
            </span>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Reason for cancellation</p>
        <RadioGroup
          value={reason ?? ""}
          onValueChange={(v) => setReason(v as CancelReasonId)}
          className="space-y-2"
        >
          {CANCEL_REASONS.map((option) => (
            <Label
              key={option.id}
              htmlFor={`wholesale-reason-${option.id}`}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all",
                reason === option.id
                  ? "border-brand bg-brand/5 shadow-sm"
                  : "border-border bg-white hover:border-brand/40 hover:bg-muted/20"
              )}
            >
              <RadioGroupItem id={`wholesale-reason-${option.id}`} value={option.id} />
              <span className="text-sm">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <FormField label="Additional details" htmlFor="wholesale-cancel-detail" optional>
        <Textarea
          id="wholesale-cancel-detail"
          rows={3}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Any additional details (optional)"
        />
      </FormField>

      <p className="text-xs text-muted-foreground">
        Prefer to talk to someone?{" "}
        <a href={SUPPORT_CONTACT_HREF} className="text-brand hover:underline">
          Contact support
        </a>
      </p>

      <Button
        type="button"
        variant="brand"
        className="w-full"
        disabled={!reason || isSubmitting}
        onClick={() => reason && void onSubmit(reason, detail)}
      >
        {isSubmitting ? "Submitting…" : "Submit cancellation request"}
      </Button>
    </div>
  );
}
