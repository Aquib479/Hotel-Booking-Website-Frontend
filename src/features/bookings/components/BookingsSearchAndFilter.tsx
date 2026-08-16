import { SearchInput } from "@/components/common/SearchInput";

interface BookingsSearchAndFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function BookingsSearchAndFilter({
  search,
  onSearchChange,
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
    </div>
  );
}
