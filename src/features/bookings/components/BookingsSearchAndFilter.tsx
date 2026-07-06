import { Search } from "lucide-react";
import { LaneFilterToggle } from "./LaneFilterToggle";
import type { LaneFilter } from "../types";

interface BookingsSearchAndFilterProps {
  search: string;
  lane: LaneFilter;
  onSearchChange: (value: string) => void;
  onLaneChange: (lane: LaneFilter) => void;
}

export function BookingsSearchAndFilter({
  search,
  lane,
  onSearchChange,
  onLaneChange,
}: BookingsSearchAndFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search hotel or location…"
          className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          aria-label="Search bookings"
        />
      </div>
      <LaneFilterToggle value={lane} onChange={onLaneChange} />
    </div>
  );
}
