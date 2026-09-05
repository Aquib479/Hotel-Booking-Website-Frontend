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
import { useLanguage } from "@/context/LanguageContext";

export function LandingSearchBar() {
  const navigate = useNavigate();
  const { t } = useLanguage();
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
      setError(t("err.location"));
      return;
    }
    if (!checkIn || !checkOut) {
      setError(t("err.dates"));
      return;
    }
    if (checkOut <= checkIn) {
      setError(t("err.checkoutAfter"));
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
        guests: formatOccupancyLabel(occupancy, t),
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
      <div className="flex flex-col overflow-visible rounded-[1.75rem] bg-white shadow-[0_20px_50px_rgba(15,23,42,0.1)] lg:h-[7.25rem] lg:flex-row lg:items-center lg:pl-8 lg:pr-2 lg:py-2">
        <div className="min-w-0 flex-1 border-b border-slate-100 px-5 py-4 lg:flex lg:h-full lg:items-center lg:border-b-0 lg:border-r lg:px-0 lg:py-0 lg:pr-6">
          <div className="w-full">
            <p className="mb-1 text-[13px] font-medium text-slate-400">{t("common.location")}</p>
            <LocationSearchField
              value={location}
              onChange={(next) => {
                setLocation(next);
                setError(null);
              }}
              variant="landing"
              label=""
              lockPage
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 border-b border-slate-100 px-5 py-4 lg:flex lg:h-full lg:items-center lg:border-b-0 lg:border-r lg:px-6 lg:py-0">
          <div className="w-full">
            <p className="mb-1 text-[13px] font-medium text-slate-400">{t("common.date")}</p>
            <DateRangeField
              label=""
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
                setCheckIn(nextIn);
                setCheckOut(nextOut);
                setError(null);
              }}
              className="flex-none"
              triggerClassName="rounded-none bg-transparent px-0 py-1 hover:bg-transparent"
            />
          </div>
        </div>

        <div className="min-w-0 flex-[0.85] px-5 py-4 lg:flex lg:h-full lg:items-center lg:px-6 lg:py-0">
          <div className="w-full">
            <p className="mb-1 text-[13px] font-medium text-slate-400">{t("common.people")}</p>
            <OccupancyPicker value={occupancy} onChange={setOccupancy}>
              <button
                type="button"
                className="flex w-full min-w-0 items-center gap-2 py-1 text-left"
              >
                <Users className="size-4 shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                  {formatOccupancyLabel(occupancy, t)}
                </span>
                <ChevronDown className="size-4 shrink-0 text-slate-400" />
              </button>
            </OccupancyPicker>
          </div>
        </div>

        <div className="flex shrink-0 items-center p-2 lg:pl-3 lg:pr-2">
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isLoading}
            className="h-11 w-full rounded-lg bg-gradient-to-r from-sky-500 to-teal-400 p-6 text-sm font-semibold text-white shadow-none hover:from-sky-500 hover:to-teal-400 hover:opacity-95 lg:w-auto lg:min-w-[9.5rem]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : null}
            {isLoading ? t("common.searching") : t("landing.searchHotel")}
          </Button>
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
