import { CreditCard, Smartphone, Star, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SavedPaymentMethod } from "../types";

interface PaymentMethodCardProps {
  method: SavedPaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
}

export function PaymentMethodCard({ method, onSetDefault, onRemove }: PaymentMethodCardProps) {
  const Icon = method.type === "card" ? CreditCard : Smartphone;

  return (
    <Card padding="none">
      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/80">
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
            <Badge variant="brand">
              <Star className="size-3" />
              Default
            </Badge>
          ) : (
            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-xs"
              onClick={onSetDefault}
            >
              Set default
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label="Remove payment method"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
