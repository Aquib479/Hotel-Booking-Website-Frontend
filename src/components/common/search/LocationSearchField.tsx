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
  value: LocationSuggestion | null;
  onChange: (location: LocationSuggestion) => void;
  variant?: SearchPanelVariant;
  label?: string;
}

const fieldStyles: Record<SearchPanelVariant, string> = {
  hero: "rounded-2xl px-4 py-3 hover:bg-black/5 sm:px-5",
  page: "px-4 py-3 hover:bg-muted/50 sm:px-5",
  landing: "w-full rounded-xl bg-muted/50 px-3 py-3 text-left hover:bg-muted/80",
};

const MIN_QUERY_LENGTH = 3;

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
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!open) return;

    if (debouncedQuery.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    searchLocations(debouncedQuery)
      .then((results) => {
        if (!cancelled) {
          setSuggestions(results);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setSuggestions([]);
          setLoading(false);
          setError(err instanceof Error ? err.message : "Failed to load locations");
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
      setError(null);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const handleSelect = (location: LocationSuggestion) => {
    onChange(location);
    setOpen(false);
    setQuery("");
    setSuggestions([]);
    setError(null);
  };

  const trimmedQuery = query.trim();
  const showLabel = Boolean(label);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 w-full max-w-full flex-1 overflow-hidden text-left transition-colors",
            showLabel ? "flex-col items-start gap-0.5" : "flex-row items-center gap-2",
            fieldStyles[variant],
          )}
        >
          {showLabel ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {label}
            </span>
          ) : (
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              variant === "hero" ? "text-sm sm:text-base" : "text-sm",
              value?.city || value?.label
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground"
            )}
          >
            {value?.label || value?.city || "Where to?"}
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
              placeholder="Type at least 3 characters..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {loading && (
              <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        <ul className="max-h-64 overflow-y-auto p-1">
          {trimmedQuery.length < MIN_QUERY_LENGTH && (
            <li className="p-3 text-center text-sm text-muted-foreground">
              Type at least {MIN_QUERY_LENGTH} characters to search locations.
            </li>
          )}

          {error && (
            <li className="px-3 py-6 text-center text-sm text-red-600">{error}</li>
          )}

          {!error &&
            trimmedQuery.length >= MIN_QUERY_LENGTH &&
            !loading &&
            suggestions.length === 0 && (
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
                  value?.id === item.id && "bg-muted",
                )}
              >
                <span className="text-sm font-medium text-foreground">
                  {item.label || item.city}
                </span>
                <span className="text-xs text-muted-foreground">
                  {[item.type, item.state, item.country].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
