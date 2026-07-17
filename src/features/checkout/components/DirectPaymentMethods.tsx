import { useState } from "react";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectableCard } from "@/components/common/SelectableCard";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
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
    <SectionCard title="Payment method" description="Choose how you'd like to pay">
      <div className="grid gap-3 sm:grid-cols-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = ICONS[method.id];
          const isSelected = selectedMethod === method.id;
          return (
            <SelectableCard
              key={method.id}
              selected={isSelected}
              onClick={() => onSelectMethod(method.id)}
            >
              <Icon className={cn("size-5", isSelected ? "text-brand" : "text-muted-foreground")} />
              <span className="text-sm font-semibold">{method.label}</span>
              <span className="text-xs text-muted-foreground">{method.description}</span>
            </SelectableCard>
          );
        })}
      </div>

      <Button
        type="button"
        variant="brand"
        size="lg"
        onClick={handlePay}
        disabled={disabled || !selectedMethod || isSubmitting}
        title={disabled ? disabledReason : undefined}
        className="mt-4 hidden h-12 w-full lg:flex"
      >
        {isSubmitting ? "Processing…" : `Pay ${payAmountLabel} now`}
      </Button>
    </SectionCard>
  );
}

export function usePaymentMethodSelection() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>("ewallet");
  return { selectedMethod, setSelectedMethod };
}
