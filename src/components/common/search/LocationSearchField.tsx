import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { searchLocations } from "./location-api";
import type { LocationSuggestion, SearchPanelVariant } from "./types";

interface LocationSearchFieldProps {
  value: LocationSuggestion;
  onChange: (location: LocationSuggestion) => void;
  variant?: SearchPanelVariant;
  label?: string;
}

const fieldStyles: Record<SearchPanelVariant, string> = {
  hero: "rounded-2xl px-4 py-3 hover:bg-black/5 sm:px-5",
  page: "px-4 py-3 hover:bg-muted/50 sm:px-5",
};

export function LocationSearchField({
  value,
  onChange,
  variant = "hero",
  label = "Location",
}: LocationSearchFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!open) return;

    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    searchLocations(debouncedQuery).then((results) => {
      if (!cancelled) {
        setSuggestions(results);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setSuggestions([]);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleSelect = (location: LocationSuggestion) => {
    onChange(location);
    setOpen(false);
    setQuery("");
    setSuggestions([]);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left transition-colors",
            fieldStyles[variant],
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {label}
          </span>
          <span
            className={cn(
              "truncate font-semibold text-foreground",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm",
            )}
          >
            {value.city}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b border-border p-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city, state or country..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading && (
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <ul className="max-h-64 overflow-y-auto p-1">
          {query.trim().length < 2 && (
            <li className="p-3 text-center text-sm text-muted-foreground">
              Search location by city, state or country.
            </li>
          )}

          {query.trim().length >= 2 && !loading && suggestions.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No locations found. Try a different spelling.
            </li>
          )}

          {suggestions.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item)}
                className={cn(
                  "flex w-full flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
                  value.id === item.id && "bg-muted",
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {item.city}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[item.state, item.country].filter(Boolean).join(", ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
