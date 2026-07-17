import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { SelectableCard } from "@/components/common/SelectableCard";
import { SectionCard } from "@/components/common/SectionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const MASKED_LABELS: Record<
  PaymentMethod,
  { label: string; masked: string; type: "card" | "ewallet" }
> = {
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
    <SectionCard
      title="Saved payment methods"
      description="Tokenized via Midtrans/Xendit for faster checkout"
    >
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && methods.length === 0 && (
        <Alert className="border-dashed">
          <AlertDescription>
            No saved payment methods yet — these are added automatically after your first booking,
            or you can add one below.
          </AlertDescription>
        </Alert>
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

      <div className="mt-4">
        <p className="mb-2 text-sm font-medium">Add payment method</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = ICONS[method.id];
            return (
              <SelectableCard key={method.id} onClick={() => handleAdd(method.id)}>
                <Icon className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">{method.label}</span>
                <span className="text-xs text-muted-foreground">Save for later</span>
              </SelectableCard>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
