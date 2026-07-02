import { useEffect, useState } from "react";
import { CalendarDays, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
  initialCheckIn?: Date;
  initialCheckOut?: Date;
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
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  onSubmit,
}: SearchPanelProps) {
  const [location, setLocation] = useState<LocationSuggestion>(() =>
    resolveLocation(initialLocation)
  );
  const [checkIn, setCheckIn] = useState<Date | undefined>(
    initialCheckIn ?? new Date(2025, 11, 19)
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    initialCheckOut ?? new Date(2026, 0, 2)
  );
  const [guests, setGuests] = useState<string>(initialGuests ?? GUEST_OPTIONS[2]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLocation(resolveLocation(initialLocation));
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
    if (initialGuests) setGuests(initialGuests);
  }, [initialLocation, initialCheckIn, initialCheckOut, initialGuests]);

  const formatDate = (date?: Date) =>
    date
      ? date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })
      : "Select date";

  const isHero = variant === "hero";
  const locationLabel = isHero ? "Location" : "Where";
  const checkInLabel = isHero ? "Check in" : "Check-in";
  const checkOutLabel = isHero ? "Check out" : "Check-out";
  const guestLabel = isHero ? "Guest" : "Guests";

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await Promise.resolve(onSubmit({ location, checkIn, checkOut, guests }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-0",
        isHero
          ? "mx-auto max-w-5xl rounded-full bg-white p-2 shadow-2xl shadow-black/10 sm:p-2.5"
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

      <DateField
        label={checkInLabel}
        value={formatDate(checkIn)}
        selected={checkIn}
        onSelect={setCheckIn}
        variant={variant}
      />

      <div className={cn("hidden w-px bg-border", isHero ? "h-10 sm:block" : "h-12 lg:block")} />

      <DateField
        label={checkOutLabel}
        value={formatDate(checkOut)}
        selected={checkOut}
        onSelect={setCheckOut}
        disabled={{ before: checkIn ?? new Date() }}
        variant={variant}
      />

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
  );
}
