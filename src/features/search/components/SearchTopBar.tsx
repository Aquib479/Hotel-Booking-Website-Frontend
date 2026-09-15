import { SearchPanel } from "@/components/common/search";
import { toLocationSuggestion } from "@/components/common/search/location-api";
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
          initialLocation={toLocationSuggestion(
            query.location,
            query.destinationId,
            query.country,
          )}
          initialMode={query.mode}
          initialCheckIn={query.checkIn}
          initialCheckOut={query.checkOut}
          initialRestDate={query.restDate}
          initialSlot={query.slot}
          initialGuests={query.guests}
          onSubmit={(values) =>
            onSearch({
              location: values.location.city,
              destinationId: values.location.destinationId,
              country: values.location.country,
              mode: values.mode,
              checkIn: values.checkIn,
              checkOut: values.checkOut,
              restDate: values.restDate,
              slot: values.slot,
              guests: values.guests,
            })
          }
        />
      </div>
    </div>
  );
}
