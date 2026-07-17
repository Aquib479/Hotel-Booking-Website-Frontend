import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LaneFilter } from "../types";
import { LANE_FILTER_OPTIONS } from "../constants";

interface LaneFilterToggleProps {
  value: LaneFilter;
  onChange: (lane: LaneFilter) => void;
}

export function LaneFilterToggle({ value, onChange }: LaneFilterToggleProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as LaneFilter)}>
      <TabsList aria-label="Filter by booking type">
        {LANE_FILTER_OPTIONS.map((opt) => (
          <TabsTrigger key={opt.id} value={opt.id} className="text-xs sm:text-sm">
            {opt.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
