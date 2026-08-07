import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangeField } from "@/components/common/DateRangeField";
import {
  OccupancyPicker,
  formatOccupancyLabel,
  type OccupancySelection,
} from "@/components/common/OccupancyPicker";
import { LocationSearchField } from "@/components/common/search/LocationSearchField";
import { buildSearchParams } from "@/components/common/search/location-api";
import type { LocationSuggestion } from "@/components/common/search/types";

export function LandingSearchBar() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationSuggestion | null>(null);
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [occupancy, setOccupancy] = useState<OccupancySelection>({
    rooms: 1,
    adults: 2,
    children: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!location || !(location.city || location.label).trim()) {
      setError("Please select a location");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in");
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      const params = buildSearchParams({
        location,
        mode: "stay",
        checkIn,
        checkOut,
        guests: formatOccupancyLabel(occupancy),
        rooms: occupancy.rooms,
        adults: occupancy.adults,
        children: occupancy.children,
      });
      navigate(`/search?${params.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-visible rounded-[1.75rem] border border-white/40 bg-white/95 p-4 shadow-2xl shadow-black/25 backdrop-blur-xl transition duration-300 hover:shadow-brand/20 sm:p-5">
        <div className="grid gap-3 overflow-visible lg:grid-cols-[1.2fr_1.4fr_1fr_auto] lg:items-end">
          <div className="min-w-0">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Location
            </p>
            <LocationSearchField
              value={location}
              onChange={(next) => {
                setLocation(next);
                setError(null);
              }}
              variant="landing"
              label=""
            />
          </div>

          <DateRangeField
            label="Date"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
              setCheckIn(nextIn);
              setCheckOut(nextOut);
              setError(null);
            }}
            triggerClassName="rounded-xl bg-muted/50"
          />

          <div className="min-w-0">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              People
            </p>
            <OccupancyPicker value={occupancy} onChange={setOccupancy}>
              <button
                type="button"
                className="flex w-full min-w-0 items-center gap-2 rounded-xl bg-muted/50 px-3 py-3 text-left transition hover:bg-muted/80"
              >
                <Users className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                  {formatOccupancyLabel(occupancy)}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </button>
            </OccupancyPicker>
          </div>

          <Button
            type="button"
            variant="brand"
            onClick={handleSearch}
            disabled={isLoading}
            className="h-13 rounded-xl px-8 text-base font-semibold lg:self-end"
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            {isLoading ? "Searching..." : "Search Hotel"}
          </Button>
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-center text-sm text-red-200">{error}</p>
      ) : null}
    </div>
  );
}
