import { useState } from "react";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_METHODS } from "../constants";
import type { PaymentMethod } from "../types";

const ICONS = {
  ewallet: Smartphone,
  virtual_account: Building2,
  card: CreditCard,
} as const;

interface DirectPaymentMethodsProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  payAmountLabel: string;
  onSubmitPayment: (method: PaymentMethod) => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
}

export function DirectPaymentMethods({
  selectedMethod,
  onSelectMethod,
  payAmountLabel,
  onSubmitPayment,
  isSubmitting,
  disabled,
  disabledReason,
}: DirectPaymentMethodsProps) {
  const handlePay = () => {
    if (!selectedMethod || disabled || isSubmitting) return;
    onSubmitPayment(selectedMethod);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Payment method</h2>
        <p className="text-sm text-muted-foreground">Choose how you&apos;d like to pay</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = ICONS[method.id];
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-brand bg-brand/5 ring-2 ring-brand/30"
                  : "border-border bg-white hover:border-brand/40"
              )}
            >
              <Icon className={cn("size-5", isSelected ? "text-brand" : "text-muted-foreground")} />
              <span className="text-sm font-semibold text-foreground">{method.label}</span>
              <span className="text-xs text-muted-foreground">{method.description}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handlePay}
        disabled={disabled || !selectedMethod || isSubmitting}
        title={disabled ? disabledReason : undefined}
        className={cn(
          "hidden h-12 w-full rounded-xl bg-brand text-base font-semibold text-white transition-opacity hover:bg-brand/90 lg:block",
          (disabled || !selectedMethod) && "cursor-not-allowed opacity-50"
        )}
      >
        {isSubmitting ? "Processing…" : `Pay ${payAmountLabel} now`}
      </button>
    </div>
  );
}

export function usePaymentMethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>("ewallet");
  return { selectedMethod, setSelectedMethod };
}
