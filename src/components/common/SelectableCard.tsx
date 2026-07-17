import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  as?: "button" | "div";
}

export function SelectableCard({
  selected,
  onClick,
  disabled,
  children,
  className,
  as = "button",
}: SelectableCardProps) {
  const classes = cn(
    "flex w-full flex-col items-start gap-2 rounded-2xl border p-5 text-left shadow-sm transition-all",
    selected
      ? "border-brand bg-brand/5 ring-2 ring-brand/25"
      : "border-border bg-card hover:border-brand/40 hover:shadow-md",
    disabled && "cursor-not-allowed opacity-50",
    className
  );

  if (as === "div") {
    return <div className={classes}>{children}</div>;
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
