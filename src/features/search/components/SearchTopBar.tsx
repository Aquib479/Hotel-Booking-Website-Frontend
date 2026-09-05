import { SearchPanel } from "@/components/common/search";
import type { LocationSuggestion } from "@/components/common/search";
import type { SearchQuery } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface SearchTopBarProps {
  query: SearchQuery;
  onSearch: (query: Partial<SearchQuery>) => void;
  className?: string;
}

function queryToLocation(query: SearchQuery): LocationSuggestion | undefined {
  if (!query.location.trim()) return undefined;

  return {
    id: query.locationId || query.location,
    label:
      [query.location, query.state, query.country].filter(Boolean).join(", ") ||
      query.location,
    city: query.location,
    state: query.state,
    country: query.country || "",
    type: query.locationType as LocationSuggestion["type"],
    referenceId: query.referenceId,
    coordinates:
      query.lat != null && query.lng != null
        ? { lat: query.lat, long: query.lng }
        : undefined,
  };
}

export function SearchTopBar({ query, onSearch, className }: SearchTopBarProps) {
  const { t } = useLanguage();
  return (
    <div
      className={
        className ??
        "border-b border-border bg-gradient-to-r from-brand/5 via-white to-brand/10"
      }
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-2 sm:px-8">
        <SearchPanel
          variant="page"
          submitLabel={t("search.update")}
          initialLocation={queryToLocation(query)}
          initialMode={query.mode}
          initialCheckIn={query.checkIn}
          initialCheckOut={query.checkOut}
          initialRestDate={query.restDate}
          initialSlot={query.slot}
          initialGuests={query.guests || undefined}
          onSubmit={(values) =>
            onSearch({
              location: values.location.city || values.location.label,
              mode: values.mode,
              checkIn: values.checkIn,
              checkOut: values.checkOut,
              restDate: values.restDate,
              slot: values.slot,
              guests: values.guests,
              rooms: values.rooms,
              adults: values.adults,
              children: values.children,
              locationId: values.location.id,
              locationType: values.location.type,
              referenceId: values.location.referenceId ?? undefined,
              lat: values.location.coordinates?.lat,
              lng: values.location.coordinates?.long,
              country: values.location.country || undefined,
              state: values.location.state,
            })
          }
        />
      </div>
    </div>
  );
}
