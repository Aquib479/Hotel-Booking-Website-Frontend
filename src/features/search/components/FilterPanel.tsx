import { cn } from "@/lib/utils";
import {
  COUNT_OPTIONS,
  ROOM_TYPE_OPTIONS,
  SLOT_DURATION_OPTIONS,
  STAR_RATING_OPTIONS,
} from "../constants";
import type { CountFilter, FilterState } from "../types";

interface FilterPanelProps {
  filters: FilterState;
  activeFilterCount: number;
  mode: "rest" | "stay";
  onUpdate: (patch: Partial<FilterState>) => void;
  onClear: () => void;
}

function CountSelector({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CountFilter;
  onChange: (value: CountFilter) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {COUNT_OPTIONS.map((option) => {
          const parsed = option === "any" ? "any" : option === "5+" ? 5 : Number(option);
          const isActive = value === parsed;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(parsed as CountFilter)}
              className={cn(
                "size-9 rounded-full border text-sm font-medium transition-colors",
                isActive
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border bg-white text-muted-foreground hover:border-brand/40"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterPanel({
  filters,
  activeFilterCount,
  mode,
  onUpdate,
  onClear,
}: FilterPanelProps) {
  return (
    <aside className="rounded-2xl border border-border bg-[#f9f9fb] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-brand hover:text-brand/80"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        <section>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Booking lane</h4>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { value: "all" as const, label: "All" },
                { value: "direct" as const, label: "RestHalf Exclusive" },
                { value: "wholesale" as const, label: "Partner rates" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ lane: option.value })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filters.lane === option.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-white text-muted-foreground hover:border-brand/40"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Min price (USD)
              </label>
              <input
                type="number"
                value={filters.priceMin}
                min={0}
                onChange={(e) => onUpdate({ priceMin: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Max price (USD)
              </label>
              <input
                type="number"
                value={filters.priceMax}
                min={filters.priceMin}
                onChange={(e) => onUpdate({ priceMax: Number(e.target.value) })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium outline-none"
              />
            </div>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Star rating</h4>
          <div className="flex flex-wrap gap-2">
            {STAR_RATING_OPTIONS.map((option) => {
              const parsed = option === "any" ? "any" : Number(option);
              const isActive = filters.starRating === parsed;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onUpdate({ starRating: parsed as CountFilter })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-white text-muted-foreground hover:border-brand/40"
                  )}
                >
                  {option === "any" ? "Any" : `${option}+ stars`}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Room type</h4>
          <div className="flex flex-wrap gap-2">
            {ROOM_TYPE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onUpdate({ roomType: option.value })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  filters.roomType === option.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-white text-muted-foreground hover:border-brand/40"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <CountSelector
          label="Max occupancy"
          value={filters.maxOccupancy}
          onChange={(maxOccupancy) => onUpdate({ maxOccupancy })}
        />

        {mode === "rest" && (
          <section>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Slot duration</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onUpdate({ slotDuration: "any" })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  filters.slotDuration === "any"
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border bg-white text-muted-foreground hover:border-brand/40"
                )}
              >
                Any
              </button>
              {SLOT_DURATION_OPTIONS.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  onClick={() => onUpdate({ slotDuration: duration })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    filters.slotDuration === duration
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-border bg-white text-muted-foreground hover:border-brand/40"
                  )}
                >
                  {duration}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
