import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingPolicySnapshot } from "../types";

interface BookingDetailPolicyPanelProps {
  policy: BookingPolicySnapshot;
  lockedAtBooking?: boolean;
}

export function BookingDetailPolicyPanel({
  policy,
  lockedAtBooking = true,
}: BookingDetailPolicyPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <h2 className="text-sm font-semibold text-foreground">Cancellation policy</h2>
          {lockedAtBooking && (
            <p className="text-xs text-muted-foreground">As agreed at time of booking</p>
          )}
          <p className="mt-0.5 text-sm text-muted-foreground">{policy.headline}</p>
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      {expanded && (
        <ul className="mt-3 space-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
          {policy.bullets.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-brand">•</span>
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
