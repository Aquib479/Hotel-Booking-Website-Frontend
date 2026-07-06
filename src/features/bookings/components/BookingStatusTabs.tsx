import { cn } from "@/lib/utils";
import type { BookingTabStatus } from "../types";
import { BOOKING_STATUS_TABS } from "../constants";

interface BookingStatusTabsProps {
  active: BookingTabStatus;
  counts: Record<BookingTabStatus, number>;
  onChange: (status: BookingTabStatus) => void;
}

export function BookingStatusTabs({ active, counts, onChange }: BookingStatusTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-border" role="tablist" aria-label="Booking status">
      {BOOKING_STATUS_TABS.map((tab) => {
        const count = counts[tab.id];
        const isActive = active === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "border-brand text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {count > 0 && (
              <span
                className={cn(
                  "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                  isActive ? "bg-brand/15 text-brand" : "bg-muted text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
