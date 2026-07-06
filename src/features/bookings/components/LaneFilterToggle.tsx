import { cn } from "@/lib/utils";
import type { LaneFilter } from "../types";
import { LANE_FILTER_OPTIONS } from "../constants";

interface LaneFilterToggleProps {
  value: LaneFilter;
  onChange: (lane: LaneFilter) => void;
}

export function LaneFilterToggle({ value, onChange }: LaneFilterToggleProps) {
  return (
    <div
      className="inline-flex rounded-lg border border-border bg-muted/30 p-0.5"
      role="group"
      aria-label="Filter by booking type"
    >
      {LANE_FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            value === opt.id
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          aria-pressed={value === opt.id}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
