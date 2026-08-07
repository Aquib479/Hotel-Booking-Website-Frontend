import { useId, useState, type ReactNode } from "react";
import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCurrency } from "@/context/CurrencyContext";
import { convertFromUsd, formatPrice } from "@/lib/currency/format";
import { defaultPriceMaxForCurrency } from "@/lib/currency/pricing";
import type { CurrencyCode } from "@/lib/currency/types";
import type { AmenityFilter, RoomType, SlotDuration } from "@/lib/booking/types";
import { cn } from "@/lib/utils";
import {
  AIRPORT_DISTANCE_OPTIONS,
  BUDGET_PRESETS_USD,
  DEFAULT_PRICE_MAX_USD,
  DEFAULT_PRICE_MIN,
  GUEST_RATING_OPTIONS,
  POPULAR_AMENITY_FILTERS,
  PROPERTY_FACILITY_FILTERS,
  ROOM_FACILITY_FILTERS,
  ROOM_TYPE_OPTIONS,
  SLOT_DURATION_OPTIONS,
  STAR_CHECKBOX_OPTIONS,
} from "../constants";
import type { FilterState } from "../types";

interface SearchFilterSidebarProps {
  filters: FilterState;
  activeFilterCount: number;
  mode: "rest" | "stay";
  locationLabel?: string;
  onUpdate: (patch: Partial<FilterState>) => void;
  onClear: () => void;
  onToggleAmenity: (amenity: AmenityFilter) => void;
  className?: string;
}

function FilterSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-border py-5 first:pt-0 last:border-b-0">
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-3 space-y-2.5">{children}</div>
    </section>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  hint,
  children,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  hint?: string;
  children?: ReactNode;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onChange(value === true)}
        className="mt-0.5"
      />
      <span className="min-w-0 flex-1 text-sm text-foreground">
        {children ?? label}
        {hint ? (
          <span className="mt-0.5 block text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

function ShowMore({
  expanded,
  onToggle,
  hiddenCount,
}: {
  expanded: boolean;
  onToggle: () => void;
  hiddenCount: number;
}) {
  if (hiddenCount <= 0) return null;
  return (
    <button
      type="button"
      onClick={onToggle}
      className="pt-1 text-sm font-medium text-foreground underline underline-offset-2 hover:text-brand"
    >
      {expanded ? "Show Less" : "Show More"}
    </button>
  );
}

function useExpandable<T>(items: readonly T[], preview = 3) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? [...items] : items.slice(0, preview);
  return {
    visible,
    expanded,
    hiddenCount: Math.max(0, items.length - preview),
    toggle: () => setExpanded((v) => !v),
  };
}

export function SearchFilterSidebar({
  filters,
  activeFilterCount,
  mode,
  locationLabel,
  onUpdate,
  onClear,
  onToggleAmenity,
  className,
}: SearchFilterSidebarProps) {
  const { currency } = useCurrency();
  const code = currency as CurrencyCode;

  const popular = useExpandable(POPULAR_AMENITY_FILTERS, 6);
  const facilities = useExpandable(PROPERTY_FACILITY_FILTERS, 3);
  const roomFacilities = useExpandable(ROOM_FACILITY_FILTERS, 3);

  // Filter bounds are stored in the guest's selected currency (matches ZH rate currency).
  const displayMin = filters.priceMin;
  const displayMax = filters.priceMax;
  const defaultMax = defaultPriceMaxForCurrency(code);

  const toggleStar = (star: number) => {
    const exists = filters.starRatings.includes(star);
    onUpdate({
      starRatings: exists
        ? filters.starRatings.filter((s) => s !== star)
        : [...filters.starRatings, star].sort((a, b) => b - a),
    });
  };

  const setGuestRating = (value: number) => {
    onUpdate({
      guestRatingMin: filters.guestRatingMin === value ? "any" : value,
    });
  };

  return (
    <div className={cn("bg-white", className)}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3">
        <div>
          <p className="text-sm font-bold text-foreground">
            {locationLabel?.trim()
              ? `Filters for ${locationLabel}`
              : "Filters"}
          </p>
          {activeFilterCount > 0 ? (
            <p className="text-xs text-muted-foreground">
              {activeFilterCount} active
            </p>
          ) : null}
        </div>
        {activeFilterCount > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-brand hover:text-brand/80"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="px-4 pb-8">
        <FilterSection title="Popular filters">
          {popular.visible.map((amenity) => (
            <CheckRow
              key={amenity}
              checked={filters.amenities.includes(amenity)}
              onChange={() => onToggleAmenity(amenity)}
              label={amenity}
            />
          ))}
          <CheckRow
            checked={filters.starRatings.includes(5)}
            onChange={() => toggleStar(5)}
          >
            <span className="inline-flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </span>
          </CheckRow>
          <CheckRow
            checked={filters.guestRatingMin === 9}
            onChange={() => setGuestRating(9)}
            label="Great 9+"
            hint="Based on guest reviews"
          />
          <ShowMore
            expanded={popular.expanded}
            onToggle={popular.toggle}
            hiddenCount={popular.hiddenCount}
          />
        </FilterSection>

        <FilterSection
          title={`Budget (${formatPrice(displayMin, code, { compact: true })} – ${formatPrice(displayMax, code, { compact: true })}${filters.priceMax >= defaultMax ? "+" : ""})`}
        >
          <p className="text-xs text-muted-foreground">
            Price per room per night (excl. taxes)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs text-muted-foreground">
              Min
              <input
                type="number"
                min={0}
                value={displayMin}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!Number.isFinite(n)) return;
                  onUpdate({
                    priceMin: Math.min(Math.max(0, n), filters.priceMax),
                  });
                }}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-white px-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
            <label className="text-xs text-muted-foreground">
              Max
              <input
                type="number"
                min={0}
                value={displayMax}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!Number.isFinite(n)) return;
                  onUpdate({
                    priceMax: Math.max(Math.max(0, n), filters.priceMin),
                  });
                }}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-white px-2.5 text-sm outline-none focus:border-brand"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {BUDGET_PRESETS_USD.map((preset) => {
              const minLocal = convertFromUsd(preset.min, code);
              const maxLocal = convertFromUsd(preset.max, code);
              const active =
                filters.priceMin === minLocal && filters.priceMax === maxLocal;
              const label =
                preset.max >= DEFAULT_PRICE_MAX_USD && preset.min > 0
                  ? `> ${formatPrice(minLocal, code, { compact: true })}`
                  : `${formatPrice(minLocal, code, { compact: true })} – ${formatPrice(maxLocal, code, { compact: true })}`;
              return (
                <button
                  key={`${preset.min}-${preset.max}`}
                  type="button"
                  onClick={() =>
                    onUpdate({
                      priceMin: minLocal,
                      priceMax: maxLocal,
                    })
                  }
                  className={cn(
                    "rounded-lg border px-2 py-2 text-left text-xs font-medium transition-colors",
                    active
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-border bg-muted/40 text-foreground hover:border-brand/40"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {(filters.priceMin !== DEFAULT_PRICE_MIN ||
            filters.priceMax !== defaultMax) && (
            <button
              type="button"
              className="text-xs font-medium text-brand"
              onClick={() =>
                onUpdate({
                  priceMin: DEFAULT_PRICE_MIN,
                  priceMax: defaultMax,
                })
              }
            >
              Reset budget
            </button>
          )}
        </FilterSection>

        <FilterSection title="Room type">
          {ROOM_TYPE_OPTIONS.filter((o) => o.value !== "any").map((option) => (
            <CheckRow
              key={option.value}
              checked={filters.roomType === option.value}
              onChange={(checked) =>
                onUpdate({
                  roomType: checked
                    ? (option.value as RoomType)
                    : "any",
                })
              }
              label={option.label}
            />
          ))}
        </FilterSection>

        <FilterSection title="Star rating">
          {STAR_CHECKBOX_OPTIONS.map((star) => (
            <CheckRow
              key={star}
              checked={filters.starRatings.includes(star)}
              onChange={() => toggleStar(star)}
            >
              <span className="inline-flex items-center gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </span>
            </CheckRow>
          ))}
        </FilterSection>

        <FilterSection title="Guest rating">
          {GUEST_RATING_OPTIONS.map((option) => (
            <CheckRow
              key={option.value}
              checked={filters.guestRatingMin === option.value}
              onChange={() => setGuestRating(option.value)}
              label={option.label}
              hint={"hint" in option ? option.hint : undefined}
            />
          ))}
        </FilterSection>

        <FilterSection title="Property facilities & services">
          {facilities.visible.map((amenity) => (
            <CheckRow
              key={amenity}
              checked={filters.amenities.includes(amenity)}
              onChange={() => onToggleAmenity(amenity)}
              label={amenity}
            />
          ))}
          <ShowMore
            expanded={facilities.expanded}
            onToggle={facilities.toggle}
            hiddenCount={facilities.hiddenCount}
          />
        </FilterSection>

        <FilterSection title="Room facilities & services">
          {roomFacilities.visible.map((amenity) => (
            <CheckRow
              key={amenity}
              checked={filters.amenities.includes(amenity)}
              onChange={() => onToggleAmenity(amenity)}
              label={amenity}
            />
          ))}
          <ShowMore
            expanded={roomFacilities.expanded}
            onToggle={roomFacilities.toggle}
            hiddenCount={roomFacilities.hiddenCount}
          />
        </FilterSection>

        <FilterSection
          title="Location"
          description="Distance from airport"
        >
          {AIRPORT_DISTANCE_OPTIONS.map((option) => (
            <CheckRow
              key={String(option.value)}
              checked={filters.maxAirportDistance === option.value}
              onChange={(checked) =>
                onUpdate({
                  maxAirportDistance: checked ? option.value : "any",
                })
              }
              label={option.label}
            />
          ))}
        </FilterSection>

        <FilterSection title="Booking options">
          <CheckRow
            checked={filters.lane === "direct"}
            onChange={(checked) =>
              onUpdate({ lane: checked ? "direct" : "all" })
            }
            label="RestHalf Exclusive"
          />
          <CheckRow
            checked={filters.lane === "wholesale"}
            onChange={(checked) =>
              onUpdate({ lane: checked ? "wholesale" : "all" })
            }
            label="Partner rates"
          />
          {mode === "rest" ? (
            <>
              {SLOT_DURATION_OPTIONS.map((duration) => (
                <CheckRow
                  key={duration}
                  checked={filters.slotDuration === duration}
                  onChange={(checked) =>
                    onUpdate({
                      slotDuration: checked
                        ? (duration as SlotDuration)
                        : "any",
                    })
                  }
                  label={`${duration} slot`}
                />
              ))}
            </>
          ) : null}
        </FilterSection>
      </div>
    </div>
  );
}
