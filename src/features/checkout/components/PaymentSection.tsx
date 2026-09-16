import { DirectPaymentMethods } from "./DirectPaymentMethods";
import type { PaymentMethod } from "../types";
import type { useCardPaymentForm, useUpiPaymentForm } from "../hooks/usePaymentForms";

interface PaymentSectionProps {
  payAmountLabel: string;
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  onSubmitPayment: (method: PaymentMethod) => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
  /** Desktop pay button — hide when an external step CTA is used. */
  showSubmitButton?: boolean;
  cardForm: ReturnType<typeof useCardPaymentForm>;
  upiForm: ReturnType<typeof useUpiPaymentForm>;
}

export function PaymentSection({
  payAmountLabel,
  selectedMethod,
  onSelectMethod,
  onSubmitPayment,
  isSubmitting,
  disabled,
  disabledReason,
  showSubmitButton = false,
  cardForm,
  upiForm,
}: PaymentSectionProps) {
  return (
    <DirectPaymentMethods
      selectedMethod={selectedMethod}
      onSelectMethod={onSelectMethod}
      payAmountLabel={payAmountLabel}
      onSubmitPayment={onSubmitPayment}
      isSubmitting={isSubmitting}
      disabled={disabled}
      disabledReason={disabledReason}
      showSubmitButton={showSubmitButton}
      cardForm={cardForm}
      upiForm={upiForm}
    />
  );
}
