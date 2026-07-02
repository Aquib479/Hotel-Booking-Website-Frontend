import { useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSlotHold } from "../hooks/useSlotHold";

interface SlotHoldCountdownProps {
  holdExpiresAt: string;
  onExpire: () => void;
}

export function SlotHoldCountdown({ holdExpiresAt, onExpire }: SlotHoldCountdownProps) {
  const { minutes, seconds, isExpired, isWarning, isCritical } = useSlotHold(holdExpiresAt);

  useEffect(() => {
    if (isExpired) onExpire();
  }, [isExpired, onExpire]);

  const display = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        isCritical
          ? "animate-pulse border-red-300 bg-red-50"
          : isWarning
            ? "border-amber-300 bg-amber-50"
            : "border-brand/30 bg-brand/5"
      )}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2">
        <Clock
          className={cn(
            "size-4 shrink-0",
            isCritical ? "text-red-600" : isWarning ? "text-amber-600" : "text-brand"
          )}
        />
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-semibold",
              isCritical ? "text-red-700" : isWarning ? "text-amber-800" : "text-foreground"
            )}
          >
            Slot reserved · {display}
          </p>
          <p className="text-xs text-muted-foreground">
            Complete payment before your hold expires
          </p>
        </div>
      </div>
      <span className="sr-only">
        {isExpired
          ? "Your slot hold has expired"
          : `${minutes} minutes and ${seconds} seconds remaining on your slot hold`}
      </span>
    </div>
  );
}
