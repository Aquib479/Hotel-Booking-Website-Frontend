import { cn } from "@/lib/utils";
import type { CancelFlowStep } from "../types";
import { DIRECT_CANCEL_FLOW_STEPS } from "../constants";

interface CancelStepIndicatorProps {
  current: CancelFlowStep;
}

export function CancelStepIndicator({ current }: CancelStepIndicatorProps) {
  const currentIndex = DIRECT_CANCEL_FLOW_STEPS.findIndex((s) => s.id === current);

  return (
    <ol className="mb-8 flex items-center justify-between" aria-label="Cancellation progress">
      {DIRECT_CANCEL_FLOW_STEPS.map((step, i) => {
        const isActive = i === currentIndex;
        const isComplete = i < currentIndex;

        return (
          <li key={step.id} className="flex flex-1 flex-col items-center gap-1">
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-xs font-bold",
                isComplete && "bg-brand text-white",
                isActive && "border-2 border-brand bg-brand/10 text-brand",
                !isComplete && !isActive && "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? "✓" : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[10px] font-medium sm:block",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
