import { useEffect, useState } from "react";
import { addMonths, startOfDay } from "date-fns";
import { enUS, id as localeId } from "date-fns/locale";
import {
  CalendarDays,
  ChevronDown,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { BookingDateRangeCalendar } from "@/components/common/BookingDateRangeCalendar";
import { SlotPicker } from "@/components/common/SlotPicker";
import {
  OccupancyPicker,
  formatOccupancyLabel,
  parseOccupancyLabel,
  type OccupancySelection,
} from "@/components/common/OccupancyPicker";
import { useLanguage } from "@/context/LanguageContext";
import {
  getAvailableSlots,
  resolveSlotSelection,
  slotUnavailableMessage,
} from "@/lib/booking/availability";
import type { BookingMode, RestSlot } from "@/lib/booking/types";
import {
  getTimezoneForCity,
  getEarliestSelectableRestDate,
} from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";
import { LocationSearchField } from "./LocationSearchField";
import { toLocationSuggestion } from "./location-api";
import type {
  LocationSuggestion,
  SearchFormValues,
  SearchPanelVariant,
} from "./types";

interface SearchPanelProps {
  variant?: SearchPanelVariant;
  submitLabel?: string;
  initialLocation?: string | LocationSuggestion | null;
  initialMode?: BookingMode;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialRestDate?: Date;
  initialSlot?: RestSlot;
  initialGuests?: string;
  onSubmit: (values: SearchFormValues) => void | Promise<void>;
}

const fieldStyles: Record<SearchPanelVariant, string> = {
  hero: "rounded-md px-4 py-3 hover:bg-black/5 sm:px-5",
  page: "px-4 py-3 hover:bg-muted/50 sm:px-5",
  landing:
    "w-full rounded-xl border border-border bg-muted/30 px-4 py-3 text-left hover:border-brand/30",
};

function resolveLocation(
  initial?: string | LocationSuggestion | null,
): LocationSuggestion | null {
  if (!initial) return null;
  if (typeof initial === "string") {
    if (!initial.trim()) return null;
    return toLocationSuggestion(initial);
  }
  if (!initial.city?.trim() && !initial.label?.trim()) return null;
  return initial;
}

function DateField({
  label,
  value,
  selected,
  onSelect,
  disabled,
  variant,
}: {
  label: string;
  value: string;
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: { before: Date; after?: Date };
  variant: SearchPanelVariant;
}) {
  const { language } = useLanguage();
  const dateFnsLocale = language === "id" ? localeId : enUS;
  const [open, setOpen] = useState(false);
  const isPlaceholder = !selected;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left transition-colors",
            fieldStyles[variant],
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {label}
          </span>
          <span
            className={cn(
              "truncate",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm",
              isPlaceholder
                ? "font-medium text-muted-foreground"
                : "font-semibold text-foreground",
            )}
          >
            {value}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onSelect(date);
            setOpen(false);
          }}
          disabled={disabled}
          locale={dateFnsLocale}
        />
      </PopoverContent>
    </Popover>
  );
}

function StayDateRangeField({
  checkIn,
  checkOut,
  onChange,
  variant,
}: {
  checkIn?: Date;
  checkOut?: Date;
  onChange: (range: { checkIn?: Date; checkOut?: Date }) => void;
  variant: SearchPanelVariant;
}) {
  const { t, language } = useLanguage();
  const localeCode = language === "id" ? "id-ID" : "en-GB";
  const dateOpts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const label =
    checkIn && checkOut
      ? `${checkIn.toLocaleDateString(localeCode, dateOpts)} - ${checkOut.toLocaleDateString(localeCode, dateOpts)}`
      : checkIn
        ? `${checkIn.toLocaleDateString(localeCode, dateOpts)} - ${t("common.addCheckout")}`
        : t("common.addDates");

  return (
    <BookingDateRangeCalendar
      checkIn={checkIn}
      checkOut={checkOut}
      onChange={onChange}
      className="min-w-0 flex-[1.4]"
      trigger={
        <button
          type="button"
          className={cn(
            "flex w-full min-w-0 flex-col items-start gap-0.5 overflow-hidden text-left transition-colors",
            fieldStyles[variant]
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {t("common.dates")}
          </span>
          <span
            className={cn(
              "w-full truncate",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm",
              checkIn && checkOut
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground"
            )}
          >
            {label}
          </span>
        </button>
      }
    />
  );
}

export function SearchPanel({
  variant = "hero",
  submitLabel,
  initialLocation,
  initialMode,
  initialCheckIn,
  initialCheckOut,
  initialRestDate,
  initialSlot,
  initialGuests,
  onSubmit,
}: SearchPanelProps) {
  const { t, language } = useLanguage();
  const localeCode = language === "id" ? "id-ID" : "en-GB";
  const [location, setLocation] = useState<LocationSuggestion | null>(() =>
    resolveLocation(initialLocation),
  );
  const [mode, setMode] = useState<BookingMode>(initialMode ?? "stay");
  const [checkIn, setCheckIn] = useState<Date | undefined>(initialCheckIn);
  const [checkOut, setCheckOut] = useState<Date | undefined>(initialCheckOut);
  const [restDate, setRestDate] = useState<Date | undefined>(initialRestDate);
  const [slot, setSlot] = useState<RestSlot>(initialSlot ?? "12-24");
  const [occupancy, setOccupancy] = useState<OccupancySelection>(() =>
    initialGuests
      ? parseOccupancyLabel(initialGuests)
      : { rooms: 1, adults: 2, children: 0 },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [slotError, setSlotError] = useState<string | null>(null);

  const isHero = variant === "hero";
  const isLanding = variant === "landing";
  const locationLabel = isHero || isLanding ? t("common.location") : t("common.where");
  const resolvedSubmitLabel = submitLabel ?? t("common.search");
  const isRest = mode === "rest";
  const searchTimezone = getTimezoneForCity(
    location?.city ?? "",
    location?.country ?? "",
  );

  useEffect(() => {
    if (mode !== "rest" || !restDate) return;
    const resolved = resolveSlotSelection(slot, restDate, searchTimezone);
    if (resolved && resolved !== slot) setSlot(resolved);
  }, [mode, restDate, searchTimezone, slot]);

  useEffect(() => {
    setLocation(resolveLocation(initialLocation));
    if (initialMode) setMode(initialMode);
    setCheckIn(initialCheckIn);
    setCheckOut(initialCheckOut);
    setRestDate(initialRestDate);
    if (initialSlot) setSlot(initialSlot);
    if (initialGuests) setOccupancy(parseOccupancyLabel(initialGuests));
  }, [
    initialLocation,
    initialMode,
    initialCheckIn,
    initialCheckOut,
    initialRestDate,
    initialSlot,
    initialGuests,
  ]);

  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString(localeCode, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : t("common.addDate");

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!location || !(location.city || location.label).trim()) {
      setFormError(t("err.location"));
      return;
    }
    if (occupancy.adults < 1) {
      setFormError(t("err.guests"));
      return;
    }

    if (isRest) {
      if (!restDate) {
        setFormError(t("err.restDate"));
        return;
      }
      const available = getAvailableSlots(restDate, searchTimezone);
      if (available.length === 0) {
        setSlotError(t("err.noSlots"));
        return;
      }
      const resolved = resolveSlotSelection(slot, restDate, searchTimezone);
      if (!resolved) {
        setSlotError(slotUnavailableMessage(slot, restDate, searchTimezone));
        return;
      }
      if (resolved !== slot) setSlot(resolved);
      setSlotError(null);
    } else {
      if (!checkIn || !checkOut) {
        setFormError(t("err.dates"));
        return;
      }
      if (checkOut <= checkIn) {
        setFormError(t("err.checkoutAfter"));
        return;
      }
    }

    setFormError(null);
    setIsLoading(true);

    try {
      await Promise.resolve(
        onSubmit({
          location,
          mode,
          guests: formatOccupancyLabel(occupancy, t),
          rooms: occupancy.rooms,
          adults: occupancy.adults,
          children: occupancy.children,
          ...(isRest
            ? {
                restDate,
                slot:
                  resolveSlotSelection(slot, restDate!, searchTimezone) ?? slot,
              }
            : { checkIn, checkOut }),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const peopleButton = (
    <OccupancyPicker value={occupancy} onChange={setOccupancy}>
      <button
        type="button"
        className={cn(
          "flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden text-left transition-colors",
          fieldStyles[variant],
        )}
      >
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="size-3.5" />
          {t("common.people")}
        </span>
        <span
          className={cn(
            "flex w-full items-center gap-1 truncate",
            variant === "hero" ? "text-sm sm:text-base" : "text-sm",
            "font-semibold text-foreground",
          )}
        >
          <span className="truncate">{formatOccupancyLabel(occupancy, t)}</span>
          <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
        </span>
      </button>
    </OccupancyPicker>
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3",
        isHero ? "mx-auto max-w-5xl" : "",
      )}
    >
      <div
        className={cn(
          isLanding
            ? "flex w-full flex-col gap-3"
            : cn(
                "flex w-full min-w-0 flex-col gap-3 overflow-visible sm:flex-row sm:items-center sm:gap-0",
                isHero
                  ? "rounded-full bg-white p-2 shadow-2xl shadow-black/10 sm:p-2.5"
                  : "rounded-xl border border-border bg-white p-2 shadow-sm lg:flex-row lg:items-center",
              ),
        )}
      >
        <LocationSearchField
          value={location}
          onChange={(next) => {
            setLocation(next);
            setFormError(null);
          }}
          variant={variant}
          label={locationLabel}
        />

        {!isLanding && (
          <div
            className={cn(
              "hidden w-px bg-border",
              isHero ? "h-10 sm:block" : "h-12 lg:block",
            )}
          />
        )}

        {isRest ? (
          <>
            <DateField
              label={t("common.date")}
              value={formatDate(restDate)}
              selected={restDate}
              onSelect={(date) => {
                setRestDate(date);
                setSlotError(null);
                setFormError(null);
              }}
              disabled={{
                before: getEarliestSelectableRestDate(searchTimezone),
                after: addMonths(startOfDay(new Date()), 6),
              }}
              variant={variant}
            />
            {!isLanding && (
              <div
                className={cn(
                  "hidden w-px bg-border",
                  isHero ? "h-10 sm:block" : "h-12 lg:block",
                )}
              />
            )}
            <SlotPicker
              value={slot}
              onChange={(next) => {
                setSlot(next);
                setSlotError(null);
              }}
              restDate={restDate}
              hotelTimezone={searchTimezone}
              triggerClassName={fieldStyles[variant]}
            />
          </>
        ) : (
          <StayDateRangeField
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={({ checkIn: nextIn, checkOut: nextOut }) => {
              setCheckIn(nextIn);
              setCheckOut(nextOut);
              setFormError(null);
            }}
            variant={variant}
          />
        )}

        {!isLanding && (
          <div
            className={cn(
              "hidden w-px bg-border",
              isHero ? "h-10 sm:block" : "h-12 lg:block",
            )}
          />
        )}

        {peopleButton}

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            isLanding
              ? "mt-1 h-12 w-full rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand/90"
              : cn(
                  "h-12 shrink-0 px-6 text-base font-medium sm:ml-1 sm:h-14",
                  isHero
                    ? "rounded-full bg-foreground text-background hover:bg-foreground/90 sm:px-10"
                    : "rounded-xl bg-brand text-white hover:bg-brand/90 lg:px-8",
                ),
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : !isHero && !isLanding ? (
            <Search className="mr-2 size-4" />
          ) : null}
          {isLoading ? t("common.searching") : resolvedSubmitLabel}
        </Button>
      </div>
      {formError && (
        <p className="px-2 text-center text-xs text-red-600 sm:text-left">
          {formError}
        </p>
      )}
      {slotError && isRest && (
        <p className="px-2 text-center text-xs text-red-600 sm:text-left">
          {slotError}
        </p>
      )}
    </div>
  );
}
