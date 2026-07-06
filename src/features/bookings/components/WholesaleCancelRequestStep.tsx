import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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
        <Link
          to={`/bookings/${booking.id}`}
          className="inline-block rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Back to booking
        </Link>
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

      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        {booking.hotelName} · Ref {booking.confirmationCode}
        {booking.payment.supplierBookingRef && (
          <span className="block font-mono text-xs">
            Supplier ref: {booking.payment.supplierBookingRef}
          </span>
        )}
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-medium text-foreground">Reason for cancellation</legend>
        {CANCEL_REASONS.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3",
              reason === option.id ? "border-brand bg-brand/5" : "border-border"
            )}
          >
            <input
              type="radio"
              name="wholesale-reason"
              checked={reason === option.id}
              onChange={() => setReason(option.id)}
              className="accent-brand"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </fieldset>

      <textarea
        rows={3}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Any additional details (optional)"
        className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand"
      />

      <p className="text-xs text-muted-foreground">
        Prefer to talk to someone?{" "}
        <a href={SUPPORT_CONTACT_HREF} className="text-brand hover:underline">
          Contact support
        </a>
      </p>

      <button
        type="button"
        disabled={!reason || isSubmitting}
        onClick={() => reason && void onSubmit(reason, detail)}
        className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {isSubmitting ? "Submitting…" : "Submit cancellation request"}
      </button>
    </div>
  );
}
