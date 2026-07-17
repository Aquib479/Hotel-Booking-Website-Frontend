import { SectionCard } from "@/components/common/SectionCard";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WALK_IN_PAYMENT_METHODS } from "../constants";
import type { WalkInPaymentMethod } from "../types";
import { CommissionBadge } from "./CommissionBadge";
import type { CurrencyCode } from "@/lib/currency/types";

interface WalkInPaymentPanelProps {
  paymentMethod: WalkInPaymentMethod;
  onPaymentMethodChange: (method: WalkInPaymentMethod) => void;
  cashConfirmed: boolean;
  onCashConfirmedChange: (confirmed: boolean) => void;
  commissionAmount: number | null;
  commissionCurrency: CurrencyCode;
}

export function WalkInPaymentPanel({
  paymentMethod,
  onPaymentMethodChange,
  cashConfirmed,
  onCashConfirmedChange,
  commissionAmount,
  commissionCurrency,
}: WalkInPaymentPanelProps) {
  return (
    <SectionCard title="Payment" description="Property currency · local settlement">
      <RadioGroup
        value={paymentMethod}
        onValueChange={(v) => onPaymentMethodChange(v as WalkInPaymentMethod)}
        className="gap-3"
      >
        {WALK_IN_PAYMENT_METHODS.map((method) => (
          <div
            key={method.id}
            className="flex items-start gap-3 rounded-lg border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
          >
            <RadioGroupItem value={method.id} id={`payment-${method.id}`} className="mt-0.5" />
            <Label htmlFor={`payment-${method.id}`} className="cursor-pointer font-normal">
              <p className="text-sm font-medium">{method.label}</p>
              <p className="text-xs text-muted-foreground">{method.description}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {paymentMethod === "cash" && (
        <Label className="mt-4 flex cursor-pointer items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <Checkbox
            checked={cashConfirmed}
            onCheckedChange={(v) => onCashConfirmedChange(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm text-amber-900">
            I confirm cash has been collected from the guest and will be recorded for
            reconciliation.
          </span>
        </Label>
      )}

      {paymentMethod === "online" && (
        <Alert className="mt-4">
          <AlertDescription>
            After confirming, a payment link will be sent to the guest&apos;s WhatsApp number
            (mock in v1).
          </AlertDescription>
        </Alert>
      )}

      {commissionAmount !== null && commissionAmount > 0 && (
        <CommissionBadge
          amount={commissionAmount}
          currency={commissionCurrency}
          size="md"
          className="mt-4 w-full justify-between"
        />
      )}
    </SectionCard>
  );
}
