import type { BookingLane, SlotDuration } from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  lane: BookingLane;
  priceUsd: number;
  priceIdr: number;
  wholesalePricing?: WholesaleQuote;
  mode?: "rest" | "stay";
  slotDuration?: SlotDuration;
  className?: string;
  amountClassName?: string;
  unitClassName?: string;
  showUnit?: boolean;
}

export function PriceDisplay({
  lane,
  priceUsd,
  priceIdr,
  wholesalePricing,
  mode = "stay",
  slotDuration = "12h",
  className,
  amountClassName,
  unitClassName,
  showUnit = true,
}: PriceDisplayProps) {
  const { formatLanePrice } = useCurrency();
  const { amount, unit } = formatLanePrice(
    lane,
    priceUsd,
    priceIdr,
    mode,
    wholesalePricing,
    slotDuration
  );

  return (
    <span className={cn("inline-flex items-baseline gap-1", className)}>
      <span className={cn("font-bold text-foreground", amountClassName)}>{amount}</span>
      {showUnit && (
        <span className={cn("text-sm font-normal text-muted-foreground", unitClassName)}>
          {unit}
        </span>
      )}
    </span>
  );
}
