import { CreditCard, Smartphone, Star, Trash2 } from "lucide-react";
import type { SavedPaymentMethod } from "../types";

interface PaymentMethodCardProps {
  method: SavedPaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
}

export function PaymentMethodCard({ method, onSetDefault, onRemove }: PaymentMethodCardProps) {
  const Icon = method.type === "card" ? CreditCard : Smartphone;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-white p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{method.label}</p>
        <p className="text-sm text-muted-foreground">{method.maskedIdentifier}</p>
        {method.expiry && (
          <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {method.isDefault ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand">
            <Star className="size-3" />
            Default
          </span>
        ) : (
          <button
            type="button"
            onClick={onSetDefault}
            className="text-xs font-medium text-brand hover:underline"
          >
            Set default
          </button>
        )}
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600"
          aria-label="Remove payment method"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
