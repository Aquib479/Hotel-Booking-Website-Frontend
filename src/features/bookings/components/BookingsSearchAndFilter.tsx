import { SearchInput } from "@/components/common/SearchInput";
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
      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search hotel or location…"
        aria-label="Search bookings"
        containerClassName="max-w-md flex-1"
      />
      <LaneFilterToggle value={lane} onChange={onLaneChange} />
    </div>
  );
}
