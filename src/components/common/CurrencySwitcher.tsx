import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
  variant?: "default" | "overlay";
}

export function CurrencySwitcher({
  className,
  variant = "default",
}: CurrencySwitcherProps) {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <Select
      value={currency}
      onValueChange={(v) => setCurrency(v as typeof currency)}
    >
      <SelectTrigger
        className={cn(
          "h-9 w-[5.5rem] rounded-full border text-xs font-medium",
          variant === "overlay"
            ? "border-foreground/20 bg-white/70 backdrop-blur-sm"
            : "border-border bg-background",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" side="bottom" align="end" sideOffset={4}>
        {currencies.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            {c.code} · {c.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
