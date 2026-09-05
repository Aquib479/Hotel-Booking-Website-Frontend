import type { BookingMode } from "@/lib/booking/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface RestStayToggleProps {
  value: BookingMode;
  onChange: (mode: BookingMode) => void;
  className?: string;
  size?: "sm" | "md";
}

export function RestStayToggle({
  value,
  onChange,
  className,
  size = "md",
}: RestStayToggleProps) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-border bg-muted/50 p-1",
        size === "sm" ? "text-xs" : "text-sm",
        className
      )}
      role="group"
      aria-label={t("common.bookingMode")}
    >
      {(
        [
          { id: "rest" as const, label: t("common.rest"), hint: t("common.slotHint") },
          { id: "stay" as const, label: t("common.stay"), hint: t("common.overnight") },
        ] as const
      ).map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "rounded-full px-4 py-1.5 font-medium transition-colors",
            size === "md" && "sm:px-5 sm:py-2",
            value === option.id
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span>{option.label}</span>
          <span className="ml-1.5 hidden text-[10px] opacity-70 sm:inline">· {option.hint}</span>
        </button>
      ))}
    </div>
  );
}
