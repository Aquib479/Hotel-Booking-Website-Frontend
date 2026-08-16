import { CreditCard, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SavedPaymentMethod } from "../types";

interface PaymentMethodCardProps {
  method: SavedPaymentMethod;
  onRemove: () => void;
}

export function PaymentMethodCard({ method, onRemove }: PaymentMethodCardProps) {
  return (
    <Card padding="none">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/80">
          <CreditCard className="size-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground">{method.label}</p>
          <p className="text-sm text-muted-foreground">{method.maskedIdentifier}</p>
          {method.expiry && (
            <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label="Remove payment method"
          className="shrink-0 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
