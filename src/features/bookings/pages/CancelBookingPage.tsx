import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LaneBadge } from "@/components/common/LaneBadge";
import { NoActiveDraftState } from "@/features/checkout/components/NoActiveDraftState";
import { Button } from "@/components/ui/button";
import { submitCancellation, submitWholesaleCancelRequest } from "../api";
import { CancelFlowLayout } from "../components/CancelFlowLayout";
import { CancelStepIndicator } from "../components/CancelStepIndicator";
import { CancelReasonStep } from "../components/CancelReasonStep";
import { RefundPreviewStep } from "../components/RefundPreviewStep";
import { CancelConfirmationStep } from "../components/CancelConfirmationStep";
import { WholesaleCancelRequestStep } from "../components/WholesaleCancelRequestStep";
import { CancelFlowExitGuard } from "../components/CancelFlowExitGuard";
import { BookingDetailSkeleton } from "../components/BookingDetailSkeleton";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { useBookingEligibility } from "../hooks/useBookingEligibility";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useCancelFlow } from "../hooks/useCancelFlow";
import { useRefundPreview } from "../hooks/useRefundPreview";
import type { CancelBookingResult, CancelReasonId } from "../types";
import { useLanguage } from "@/context/LanguageContext";

export function CancelBookingPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useRequireAuth(`/bookings/${id}/cancel`);
  const { booking, isLoading, error } = useBookingDetail(id);
  const eligibility = useBookingEligibility(booking);

  const flow = useCancelFlow();
  const refundPreview = useRefundPreview(
    id,
    flow.reason,
    flow.step === "preview" && booking?.lane === "direct"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelResult, setCancelResult] = useState<CancelBookingResult | null>(null);
  const [wholesaleRef, setWholesaleRef] = useState<string | null>(null);

  const handleConfirmCancel = useCallback(async () => {
    if (!id || !flow.reason || !refundPreview.preview) return;
    setIsSubmitting(true);
    try {
      const result = await submitCancellation(id, flow.reason, flow.reasonDetail);
      setCancelResult(result);
      flow.goToConfirmation();
    } finally {
      setIsSubmitting(false);
    }
  }, [id, flow, refundPreview.preview]);

  const handleWholesaleSubmit = useCallback(
    async (reason: CancelReasonId, detail: string) => {
      if (!id) return;
      setIsSubmitting(true);
      try {
        const result = await submitWholesaleCancelRequest(id, reason, detail);
        setWholesaleRef(result.referenceId);
      } finally {
        setIsSubmitting(false);
      }
    },
    [id]
  );

  if (!isAuthenticated) return null;

  if (isLoading) {
    return <BookingDetailSkeleton />;
  }

  if (error || !booking || !eligibility) {
    return (
      <NoActiveDraftState
        title={t("bookings.notFound")}
        body={t("bookings.notFoundCancelBody")}
        cta={t("bookings.back")}
        searchHref="/bookings"
      />
    );
  }

  if (booking.lane === "wholesale") {
    return (
      <CancelFlowLayout
        bookingId={booking.id}
        footer={<div />}
      >
        <WholesaleCancelRequestStep
          booking={booking}
          onSubmit={handleWholesaleSubmit}
          isSubmitting={isSubmitting}
          submittedRef={wholesaleRef}
        />
      </CancelFlowLayout>
    );
  }

  if (!eligibility.canCancel) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-xl font-bold text-foreground">{t("bookings.windowClosed")}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("bookings.windowClosedBody")}</p>
        <Button variant="brand" className="mt-6" asChild>
          <Link to={`/bookings/${booking.id}`}>{t("bookings.backToDetails")}</Link>
        </Button>
      </main>
    );
  }

  if (flow.step === "confirmation" && cancelResult) {
    return (
      <CancelFlowLayout bookingId={booking.id} footer={<div />}>
        <CancelConfirmationStep
          bookingId={booking.id}
          hotelName={booking.hotelName}
          result={cancelResult}
        />
      </CancelFlowLayout>
    );
  }

  const canContinueReason =
    flow.reason !== null && (flow.reason !== "other" || flow.reasonDetail.trim().length > 0);

  const footer = (
    <div className="flex gap-3">
      {flow.step === "preview" && (
        <Button type="button" variant="outline" className="flex-1" onClick={flow.goBack}>
          {t("common.back")}
        </Button>
      )}
      {flow.step === "reason" && (
        <Button
          type="button"
          variant="brand"
          className="flex-1"
          disabled={!canContinueReason}
          onClick={flow.goToPreview}
        >
          {t("common.continue")}
        </Button>
      )}
      {flow.step === "preview" && (
        <Button
          type="button"
          variant="destructive"
          className="flex-1 bg-red-50 text-red-700 hover:bg-red-100"
          disabled={
            isSubmitting ||
            refundPreview.isLoading ||
            Boolean(refundPreview.error) ||
            !refundPreview.preview
          }
          onClick={() => void handleConfirmCancel()}
        >
          {isSubmitting ? t("bookings.cancelling") : t("bookings.confirmCancel")}
        </Button>
      )}
    </div>
  );

  return (
    <CancelFlowExitGuard enabled={flow.step === "preview"}>
      <CancelFlowLayout bookingId={booking.id} footer={footer}>
        <div className="mb-4 flex items-center gap-2">
          <LaneBadge lane={booking.lane} />
          <span className="text-sm text-muted-foreground">{booking.confirmationCode}</span>
        </div>

        <CancelStepIndicator current={flow.step} />

        {flow.step === "reason" && (
          <CancelReasonStep
            selected={flow.reason}
            reasonDetail={flow.reasonDetail}
            onSelect={flow.setReason}
            onDetailChange={flow.setReasonDetail}
          />
        )}

        {flow.step === "preview" && (
          <RefundPreviewStep
            booking={booking}
            preview={refundPreview.preview}
            isLoading={refundPreview.isLoading}
            error={refundPreview.error}
            onRetry={refundPreview.retry}
          />
        )}
      </CancelFlowLayout>
    </CancelFlowExitGuard>
  );
}
