import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCardPaymentForm } from "@/features/checkout/hooks/usePaymentForms";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { cardValuesToSavedMethod } from "../lib/saveCard";
import type { SavedPaymentMethod } from "../types";

interface SavedPaymentMethodsSectionProps {
  methods: SavedPaymentMethod[];
  isLoading: boolean;
  onAdd: (method: Omit<SavedPaymentMethod, "id">) => void;
  onRemove: (id: string) => void;
}

export function SavedPaymentMethodsSection({
  methods,
  isLoading,
  onAdd,
  onRemove,
}: SavedPaymentMethodsSectionProps) {
  const [showAddCard, setShowAddCard] = useState(false);
  const cardForm = useCardPaymentForm();

  const handleSaveCard = () => {
    if (!cardForm.validateForm()) return;
    onAdd(cardValuesToSavedMethod(cardForm.values));
    setShowAddCard(false);
  };

  const cards = methods.filter((m) => m.type === "card");

  return (
    <SectionCard
      title="Saved cards"
      description="Add a card here, or we’ll save it automatically when you pay by card at checkout"
    >
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!isLoading && cards.length === 0 && !showAddCard && (
        <Alert className="border-dashed">
          <AlertDescription>
            No cards saved yet. Add a card below, or complete a booking with card payment and it
            will appear here.
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && (
        <div className="space-y-3">
          {cards.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onRemove={() => onRemove(method.id)}
            />
          ))}
        </div>
      )}

      {!showAddCard ? (
        <Button
          type="button"
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => setShowAddCard(true)}
        >
          <Plus className="size-4" aria-hidden />
          Add card
        </Button>
      ) : (
        <div className="mt-4 space-y-3 rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-foreground">Add a card</p>
          <p className="text-xs text-muted-foreground">
            Only the last four digits are stored — never your full card number or CVV.
          </p>

          <FormField
            label="Card holder name"
            htmlFor="save-card-holder"
            error={cardForm.touched.holderName ? cardForm.errors.holderName : undefined}
          >
            <Input
              id="save-card-holder"
              autoComplete="cc-name"
              placeholder="Name on card"
              value={cardForm.values.holderName}
              onChange={(e) => cardForm.handleChange("holderName", e.target.value)}
              onBlur={() => cardForm.handleBlur("holderName")}
            />
          </FormField>

          <FormField
            label="Card number"
            htmlFor="save-card-number"
            error={cardForm.touched.cardNumber ? cardForm.errors.cardNumber : undefined}
          >
            <div className="relative">
              <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="save-card-number"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="•••• •••• •••• ••••"
                value={cardForm.values.cardNumber}
                onChange={(e) => cardForm.handleChange("cardNumber", e.target.value)}
                onBlur={() => cardForm.handleBlur("cardNumber")}
                className="pl-10"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label="Expiry"
              htmlFor="save-card-expiry"
              error={cardForm.touched.expiry ? cardForm.errors.expiry : undefined}
            >
              <Input
                id="save-card-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={cardForm.values.expiry}
                onChange={(e) => cardForm.handleChange("expiry", e.target.value)}
                onBlur={() => cardForm.handleBlur("expiry")}
              />
            </FormField>

            <FormField
              label="CVV"
              htmlFor="save-card-cvv"
              error={cardForm.touched.cvv ? cardForm.errors.cvv : undefined}
            >
              <Input
                id="save-card-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                value={cardForm.values.cvv}
                onChange={(e) => cardForm.handleChange("cvv", e.target.value)}
                onBlur={() => cardForm.handleBlur("cvv")}
              />
            </FormField>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button type="button" className="rounded-xl" onClick={handleSaveCard}>
              Save card
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn("rounded-xl")}
              onClick={() => setShowAddCard(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
