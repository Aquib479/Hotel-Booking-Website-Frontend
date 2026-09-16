import { cn } from "@/lib/utils";
import { CHECKOUT_STEPS } from "../constants";
import type { CheckoutStep } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface CheckoutStepIndicatorProps {
  current: CheckoutStep;
}

export function CheckoutStepIndicator({ current }: CheckoutStepIndicatorProps) {
  const { t } = useLanguage();
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current);
  const progressPct =
    currentIndex <= 0 ? 0 : (currentIndex / (CHECKOUT_STEPS.length - 1)) * 100;

  return (
    <ol className="relative mb-8 flex w-full items-start" aria-label={t("checkout.progress")}>
      <div
        className="pointer-events-none absolute top-4 right-[calc(100%/6)] left-[calc(100%/6)] h-0.5 rounded-full bg-muted"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {CHECKOUT_STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isComplete = i < currentIndex;

        return (
          <li key={step.id} className="relative z-10 flex flex-1 flex-col items-center gap-2">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isComplete && "bg-brand text-white",
                isActive && "border-2 border-brand bg-brand/10 text-brand",
                !isComplete && !isActive && "border border-transparent bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? "✓" : step.id}
            </span>
            <span
              className={cn(
                "px-1 text-center text-[10px] font-medium leading-snug sm:text-xs",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t(step.labelKey)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
