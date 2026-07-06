import { useCallback, useState } from "react";
import type { CancelFlowStep, CancelReasonId } from "../types";

export function useCancelFlow() {
  const [step, setStep] = useState<CancelFlowStep>("reason");
  const [reason, setReason] = useState<CancelReasonId | null>(null);
  const [reasonDetail, setReasonDetail] = useState("");

  const selectReason = useCallback((next: CancelReasonId) => {
    setReason(next);
  }, []);

  const goToPreview = useCallback(() => {
    if (!reason) return;
    setStep("preview");
  }, [reason]);

  const goToConfirmation = useCallback(() => {
    setStep("confirmation");
  }, []);

  const goBack = useCallback(() => {
    if (step === "preview") setStep("reason");
  }, [step]);

  const reset = useCallback(() => {
    setStep("reason");
    setReason(null);
    setReasonDetail("");
  }, []);

  return {
    step,
    reason,
    reasonDetail,
    setReason: selectReason,
    setReasonDetail,
    goToPreview,
    goToConfirmation,
    goBack,
    reset,
    hasProgressPastReason: step === "preview" || step === "confirmation",
  };
}
