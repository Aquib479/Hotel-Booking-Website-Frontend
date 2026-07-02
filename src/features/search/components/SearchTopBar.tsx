import { SearchPanel } from "@/components/common/search";
import type { SearchQuery } from "../types";

interface SearchTopBarProps {
  query: SearchQuery;
  onSearch: (query: Partial<SearchQuery>) => void;
}

export function SearchTopBar({ query, onSearch }: SearchTopBarProps) {
  return (
    <div className="border-b border-border bg-[#f4f4f5] px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SearchPanel
          variant="page"
          submitLabel="Update Search"
          initialLocation={query.location}
          initialCheckIn={query.checkIn}
          initialCheckOut={query.checkOut}
          initialGuests={query.guests}
          onSubmit={(values) =>
            onSearch({
              location: values.location.city,
              checkIn: values.checkIn,
              checkOut: values.checkOut,
              guests: values.guests,
            })
          }
        />
      </div>
    </div>
  );
}
