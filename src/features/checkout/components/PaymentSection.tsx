import type { BookingLane } from "@/lib/booking/types";
import { DirectPaymentMethods } from "./DirectPaymentMethods";
import { WholesaleHandoffNotice } from "./WholesaleHandoffNotice";
import type { PaymentMethod } from "../types";

interface PaymentSectionProps {
  lane: BookingLane;
  supplierName?: string;
  payAmountLabel: string;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onSubmitPayment: (method: PaymentMethod) => void;
  onWholesaleContinue: () => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
}

export function PaymentSection({
  lane,
  supplierName,
  payAmountLabel,
  selectedMethod,
  onSelectMethod,
  onSubmitPayment,
  onWholesaleContinue,
  isSubmitting,
  disabled,
  disabledReason,
}: PaymentSectionProps) {
  if (lane === "direct") {
    return (
      <DirectPaymentMethods
        selectedMethod={selectedMethod}
        onSelectMethod={onSelectMethod}
        payAmountLabel={payAmountLabel}
        onSubmitPayment={onSubmitPayment}
        isSubmitting={isSubmitting}
        disabled={disabled}
        disabledReason={disabledReason}
      />
    );
  }

  return (
    <WholesaleHandoffNotice
      supplierName={supplierName}
      onContinue={onWholesaleContinue}
      isSubmitting={isSubmitting}
      disabled={disabled}
      disabledReason={disabledReason}
    />
  );
}
