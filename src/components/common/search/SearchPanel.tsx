import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RestStayToggle } from "@/components/common/RestStayToggle";
import { SlotPicker } from "@/components/common/SlotPicker";
import {
  getAvailableSlots,
  resolveSlotSelection,
  slotUnavailableMessage,
} from "@/lib/booking/availability";
import type { BookingMode, RestSlot } from "@/lib/booking/types";
import { getTimezoneForCity, getEarliestSelectableRestDate } from "@/lib/booking/timezone";
import { cn } from "@/lib/utils";
import { LocationSearchField } from "./LocationSearchField";
import {
  DEFAULT_LOCATION,
  GUEST_OPTIONS,
  toLocationSuggestion,
} from "./location-api";
import type { LocationSuggestion, SearchFormValues, SearchPanelVariant } from "./types";

interface SearchPanelProps {
  variant?: SearchPanelVariant;
  submitLabel?: string;
  initialLocation?: string | LocationSuggestion;
  initialMode?: BookingMode;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  initialRestDate?: Date;
  initialSlot?: RestSlot;
  initialGuests?: string;
  onSubmit: (values: SearchFormValues) => void | Promise<void>;
}

const fieldStyles: Record<SearchPanelVariant, string> = {
  hero: "rounded-2xl px-4 py-3 hover:bg-black/5 sm:px-5",
  page: "px-4 py-3 hover:bg-muted/50 sm:px-5",
};

function resolveLocation(initial?: string | LocationSuggestion): LocationSuggestion {
  if (!initial) return DEFAULT_LOCATION;
  if (typeof initial === "string") return toLocationSuggestion(initial);
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
  disabled?: { before: Date };
  variant: SearchPanelVariant;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left transition-colors",
            fieldStyles[variant]
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {label}
          </span>
          <span
            className={cn(
              "truncate font-semibold text-foreground",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm"
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
        />
      </PopoverContent>
    </Popover>
  );
}

function GuestField({
  label,
  value,
  onChange,
  variant,
}: {
  label: string;
  value: string;
  onChange: (guests: string) => void;
  variant: SearchPanelVariant;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left transition-colors",
            fieldStyles[variant]
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            {label}
          </span>
          <span
            className={cn(
              "truncate font-semibold text-foreground",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm"
            )}
          >
            {value}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-1" align="start">
        <ul>
          {GUEST_OPTIONS.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                  value === option && "bg-muted font-medium"
                )}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function SearchPanel({
  variant = "hero",
  submitLabel = "Search",
  initialLocation,
  initialMode,
  initialCheckIn,
  initialCheckOut,
  initialRestDate,
  initialSlot,
  initialGuests,
  onSubmit,
}: SearchPanelProps) {
  const [location, setLocation] = useState<LocationSuggestion>(() =>
    resolveLocation(initialLocation)
  );
  const [mode, setMode] = useState<BookingMode>(initialMode ?? "stay");
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialCheckIn ?? new Date(2025, 11, 19)
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialCheckOut ?? new Date(2026, 0, 2)
  );
  const [restDate, setRestDate] = useState<Date | undefined>(
    initialRestDate ?? new Date()
  );
  const [slot, setSlot] = useState<RestSlot>(initialSlot ?? "12-24");
  const [guests, setGuests] = useState<string>(initialGuests ?? GUEST_OPTIONS[1]);
  const [isLoading, setIsLoading] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);

  const isHero = variant === "hero";
  const locationLabel = isHero ? "Location" : "Where";
  const guestLabel = isHero ? "Guest" : "Guests";
  const isRest = mode === "rest";
  const searchTimezone = getTimezoneForCity(location.city, location.country);

  useEffect(() => {
    if (mode !== "rest" || !restDate) return;
    const resolved = resolveSlotSelection(slot, restDate, searchTimezone);
    if (resolved && resolved !== slot) setSlot(resolved);
  }, [mode, restDate, searchTimezone, slot]);

  useEffect(() => {
    setLocation(resolveLocation(initialLocation));
    if (initialMode) setMode(initialMode);
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
    if (initialRestDate) setRestDate(initialRestDate);
    if (initialSlot) setSlot(initialSlot);
    if (initialGuests) setGuests(initialGuests);
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
      ? date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
      : "Select date";

  const handleSubmit = async () => {
    if (isLoading) return;

    if (isRest) {
      if (!restDate) return;
      const available = getAvailableSlots(restDate, searchTimezone);
      if (available.length === 0) {
        setSlotError("No bookable slots on this date. Please choose another day.");
        return;
      }
      const resolved = resolveSlotSelection(slot, restDate, searchTimezone);
      if (!resolved) {
        setSlotError(slotUnavailableMessage(slot, restDate, searchTimezone));
        return;
      }
      if (resolved !== slot) setSlot(resolved);
      setSlotError(null);
    }

    setIsLoading(true);

    try {
      await Promise.resolve(
        onSubmit({
          location,
          mode,
          guests,
          ...(isRest
            ? { restDate, slot: resolveSlotSelection(slot, restDate!, searchTimezone) ?? slot }
            : { checkIn, checkOut }),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-3", isHero ? "mx-auto max-w-5xl" : "")}>
      <div className={cn("flex", isHero ? "justify-center" : "justify-start")}>
        <RestStayToggle value={mode} onChange={setMode} size={isHero ? "md" : "sm"} />
      </div>

      <div
        className={cn(
          "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-0",
          isHero
            ? "rounded-full bg-white p-2 shadow-2xl shadow-black/10 sm:p-2.5"
            : "rounded-2xl border border-border bg-white p-2 shadow-sm lg:flex-row lg:items-center"
        )}
      >
        <LocationSearchField
          value={location}
          onChange={setLocation}
          variant={variant}
          label={locationLabel}
        />

        <div className={cn("hidden w-px bg-border", isHero ? "h-10 sm:block" : "h-12 lg:block")} />

        {isRest ? (
          <>
            <DateField
              label="Date"
              value={formatDate(restDate)}
              selected={restDate}
              onSelect={(date) => {
                setRestDate(date);
                setSlotError(null);
              }}
              disabled={{ before: getEarliestSelectableRestDate(searchTimezone) }}
              variant={variant}
            />

            <div
              className={cn("hidden w-px bg-border", isHero ? "h-10 sm:block" : "h-12 lg:block")}
            />

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
          <>
            <DateField
              label={isHero ? "Check in" : "Check-in"}
              value={formatDate(checkIn)}
              selected={checkIn}
              onSelect={setCheckIn}
              variant={variant}
            />

            <div
              className={cn("hidden w-px bg-border", isHero ? "h-10 sm:block" : "h-12 lg:block")}
            />

            <DateField
              label={isHero ? "Check out" : "Check-out"}
              value={formatDate(checkOut)}
              selected={checkOut}
              onSelect={setCheckOut}
              disabled={{ before: checkIn ?? new Date() }}
              variant={variant}
            />
          </>
        )}

        <div className={cn("hidden w-px bg-border", isHero ? "h-10 sm:block" : "h-12 lg:block")} />

        <GuestField label={guestLabel} value={guests} onChange={setGuests} variant={variant} />

        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className={cn(
            "h-12 shrink-0 px-6 text-base font-medium sm:ml-1 sm:h-14",
            isHero
              ? "rounded-full bg-foreground text-background hover:bg-foreground/90 sm:px-10"
              : "rounded-xl bg-brand text-white hover:bg-brand/90 lg:px-8"
          )}
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : !isHero ? (
            <Search className="mr-2 size-4" />
          ) : null}
          {isLoading ? "Searching..." : submitLabel}
        </Button>
      </div>
      {slotError && isRest && (
        <p className="px-2 text-center text-xs text-red-600 sm:text-left">{slotError}</p>
      )}
    </div>
  );
}
