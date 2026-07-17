import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BookingTabStatus } from "../types";
import { BOOKING_STATUS_TABS } from "../constants";

interface BookingStatusTabsProps {
  active: BookingTabStatus;
  counts: Record<BookingTabStatus, number>;
  onChange: (status: BookingTabStatus) => void;
}

export function BookingStatusTabs({ active, counts, onChange }: BookingStatusTabsProps) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as BookingTabStatus)}>
      <TabsList
        variant="line"
        className="h-auto w-full justify-start gap-0 border-b border-border"
      >
        {BOOKING_STATUS_TABS.map((tab) => {
          const count = counts[tab.id];

          return (
            <TabsTrigger key={tab.id} value={tab.id} className="shrink-0">
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                    active === tab.id
                      ? "bg-brand/15 text-brand"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
