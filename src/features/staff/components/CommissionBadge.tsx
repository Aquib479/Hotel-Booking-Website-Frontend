import { formatPrice } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CommissionBadgeProps {
  amount: number;
  currency: CurrencyCode;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export function CommissionBadge({
  amount,
  currency,
  label = "Your commission",
  className,
  size = "sm",
}: CommissionBadgeProps) {
  return (
    <Badge
      variant="success"
      className={cn(
        "h-auto w-fit gap-2 px-3 py-1.5",
        size === "md" && "px-3 py-2 text-sm",
        className
      )}
    >
      <span className="font-medium">{label}</span>
      <span className={cn("font-bold", size === "md" && "text-base")}>
        {formatPrice(amount, currency)}
      </span>
    </Badge>
  );
}
