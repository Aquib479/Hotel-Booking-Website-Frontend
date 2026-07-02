import { Loader2 } from "lucide-react";
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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      title={disabled ? disabledReason : undefined}
      className={cn(
        "flex h-12 w-full items-center justify-center rounded-xl bg-brand text-base font-semibold text-white transition-opacity hover:bg-brand/90",
        (disabled || isLoading) && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
      {isLoading ? "Processing…" : label}
    </button>
  );
}
