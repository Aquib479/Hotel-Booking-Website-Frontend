import {
  Building2,
  Home,
  Tent,
  Trees,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  COUNT_OPTIONS,
  PLACE_TYPE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
} from "../constants";
import type { CountFilter, FilterState, PlaceType, PropertyType } from "../types";

const PROPERTY_ICONS: Record<PropertyType, typeof Home> = {
  house: Home,
  apartment: Building2,
  cabin: Trees,
  villa: Warehouse,
  camping: Tent,
};

interface FilterPanelProps {
  filters: FilterState;
  activeFilterCount: number;
  nights: number;
  onUpdate: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  onTogglePlaceType: (type: PlaceType) => void;
  onPropertyTypeChange: (type: PropertyType | "any") => void;
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
  nights,
  onUpdate,
  onClear,
  onTogglePlaceType,
  onPropertyTypeChange,
}: FilterPanelProps) {
  const avgTotal = 2594;

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
            Clear all filter ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        <section>
          <p className="mb-3 text-sm text-muted-foreground">
            The average total price for {nights} nights is ${avgTotal.toLocaleString()}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Minimum
              </label>
              <div className="flex items-center rounded-lg border border-border bg-white px-3 py-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={filters.priceMin}
                  min={0}
                  onChange={(e) => onUpdate({ priceMin: Number(e.target.value) })}
                  className="w-full bg-transparent pl-1 text-sm font-medium outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Maximum
              </label>
              <div className="flex items-center rounded-lg border border-border bg-white px-3 py-2">
                <span className="text-sm text-muted-foreground">$</span>
                <input
                  type="number"
                  value={filters.priceMax}
                  min={filters.priceMin}
                  onChange={(e) => onUpdate({ priceMax: Number(e.target.value) })}
                  className="w-full bg-transparent pl-1 text-sm font-medium outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Type of place</h4>
          <div className="space-y-3">
            {PLACE_TYPE_OPTIONS.map((option) => (
              <label key={option.value} className="flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={filters.placeTypes.includes(option.value)}
                  onChange={() => onTogglePlaceType(option.value)}
                  className="mt-1 size-4 rounded border-border accent-brand"
                />
                <span>
                  <span className="block text-sm font-medium text-foreground">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Rooms and beds</h4>
          <CountSelector
            label="Bedrooms"
            value={filters.bedrooms}
            onChange={(bedrooms) => onUpdate({ bedrooms })}
          />
          <CountSelector
            label="Beds"
            value={filters.beds}
            onChange={(beds) => onUpdate({ beds })}
          />
          <CountSelector
            label="Bathrooms"
            value={filters.bathrooms}
            onChange={(bathrooms) => onUpdate({ bathrooms })}
          />
        </section>

        <section>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Property type</h4>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPE_OPTIONS.map((option) => {
              const Icon = PROPERTY_ICONS[option.value];
              const isActive = filters.propertyType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    onPropertyTypeChange(isActive ? "any" : option.value)
                  }
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-colors",
                    isActive
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-border bg-white text-foreground hover:border-brand/30"
                  )}
                >
                  <Icon className="size-5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
