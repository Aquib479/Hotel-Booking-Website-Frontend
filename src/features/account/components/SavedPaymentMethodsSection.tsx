import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/features/checkout/constants";
import type { PaymentMethod } from "@/features/checkout/types";
import { PaymentMethodCard } from "./PaymentMethodCard";
import type { SavedPaymentMethod } from "../types";

const ICONS = {
  ewallet: Smartphone,
  virtual_account: Building2,
  card: CreditCard,
} as const;

interface SavedPaymentMethodsSectionProps {
  methods: SavedPaymentMethod[];
  isLoading: boolean;
  onAdd: (method: Omit<SavedPaymentMethod, "id">) => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const MASKED_LABELS: Record<PaymentMethod, { label: string; masked: string; type: "card" | "ewallet" }> = {
  card: { label: "Visa", masked: "•••• 4242", type: "card" },
  ewallet: { label: "GoPay", masked: "•••• 7890", type: "ewallet" },
  virtual_account: { label: "BCA Virtual Account", masked: "•••• 1234", type: "ewallet" },
};

export function SavedPaymentMethodsSection({
  methods,
  isLoading,
  onAdd,
  onRemove,
  onSetDefault,
}: SavedPaymentMethodsSectionProps) {
  const handleAdd = (id: PaymentMethod) => {
    const config = MASKED_LABELS[id];
    onAdd({
      type: config.type,
      label: config.label,
      maskedIdentifier: config.masked,
      expiry: id === "card" ? "12/28" : undefined,
      isDefault: false,
    });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Saved payment methods</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tokenized via Midtrans/Xendit for faster checkout
        </p>
      </div>

      {isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-16 rounded-xl bg-muted" />
        </div>
      )}

      {!isLoading && methods.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
          No saved payment methods yet — these are added automatically after your first booking,
          or you can add one below.
        </div>
      )}

      <div className="space-y-3">
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onSetDefault={() => onSetDefault(method.id)}
            onRemove={() => onRemove(method.id)}
          />
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Add payment method</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = ICONS[method.id];
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => handleAdd(method.id)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-brand/40"
                )}
              >
                <Icon className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">{method.label}</span>
                <span className="text-xs text-muted-foreground">Save for later</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
