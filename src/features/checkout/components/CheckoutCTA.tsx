import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CheckoutCTAProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  disabledReason?: string;
  isLoading: boolean;
  className?: string;
}

export function CheckoutCTA({
  label,
  onClick,
  disabled,
  disabledReason,
  isLoading,
  className,
}: CheckoutCTAProps) {
  return (
    <Button
      type="button"
      variant="brand"
      size="lg"
      onClick={onClick}
      disabled={disabled || isLoading}
      title={disabled ? disabledReason : undefined}
      className={cn("h-12 w-full text-base", className)}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? "Processing…" : label}
    </Button>
  );
}
