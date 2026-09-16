import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from "@/context/CurrencyContext";
import {
  COUNT_OPTIONS,
  ROOM_TYPE_OPTIONS,
  SLOT_DURATION_OPTIONS,
  STAR_RATING_OPTIONS,
} from "../constants";
import type { FilterState, LaneFilter } from "../types";
import type { RoomType, SlotDuration } from "@/lib/booking/types";
import { useLanguage } from "@/context/LanguageContext";

interface FilterPanelProps {
  filters: FilterState;
  activeFilterCount: number;
  mode: "rest" | "stay";
  onUpdate: (patch: Partial<FilterState>) => void;
  onClear: () => void;
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="min-w-[140px] flex-1">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-10 w-full rounded-lg border-border bg-white">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Editable number field that allows clearing "0" while typing. */
function PriceInput({
  label,
  value,
  min,
  onCommit,
}: {
  label: string;
  value: number;
  min?: number;
  onCommit: (next: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <div className="min-w-[120px] flex-1">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.]/g, "");
          if (raw === "" || raw === ".") {
            setText(raw);
            return;
          }
          if (!/^\d*\.?\d*$/.test(raw)) return;
          setText(raw);
          const n = Number(raw);
          if (!Number.isFinite(n)) return;
          const clamped = min != null ? Math.max(min, n) : Math.max(0, n);
          onCommit(clamped);
        }}
        onBlur={() => {
          if (text === "" || text === "." || !Number.isFinite(Number(text))) {
            const fallback = min ?? 0;
            setText(String(fallback));
            onCommit(fallback);
            return;
          }
          const n = Number(text);
          const clamped = min != null ? Math.max(min, n) : Math.max(0, n);
          setText(String(clamped));
          onCommit(clamped);
        }}
        className="h-10 w-full rounded-lg border border-border bg-white px-3 text-sm font-medium outline-none focus:border-brand"
      />
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
  const { t } = useLanguage();
  const { currency, currencies } = useCurrency();
  const currencyMeta = currencies.find((c) => c.code === currency);
  const currencyLabel = `${currencyMeta?.code ?? currency}${
    currencyMeta?.symbol ? ` (${currencyMeta.symbol})` : ""
  }`;

  const laneOptions =
    mode === "stay"
      ? [
          { value: "all", label: t("search.cat.all") },
          { value: "wholesale", label: t("search.partnerRates") },
        ]
      : [
          { value: "all", label: t("search.cat.all") },
          { value: "direct", label: t("common.exclusive") },
          { value: "wholesale", label: t("search.partnerRates") },
        ];

  return (
    <div className="mt-4 rounded-md border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">{t("search.filters")}</h3>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-brand hover:text-brand/80"
          >
            {t("search.clearAllN", { n: activeFilterCount })}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <FilterSelect
          label={t("search.bookingLane")}
          value={filters.lane}
          onChange={(v) => onUpdate({ lane: v as LaneFilter })}
          options={laneOptions}
        />

        <PriceInput
          label={`${t("search.minPrice")} (${currencyLabel})`}
          value={filters.priceMin}
          onCommit={(priceMin) => onUpdate({ priceMin })}
        />

        <PriceInput
          label={`${t("search.maxPrice")} (${currencyLabel})`}
          value={filters.priceMax}
          min={filters.priceMin}
          onCommit={(priceMax) => onUpdate({ priceMax })}
        />

        <FilterSelect
          label={t("search.starRating")}
          value={
            filters.starRatings.length === 1
              ? String(filters.starRatings[0])
              : "any"
          }
          onChange={(v) =>
            onUpdate({
              starRatings: v === "any" ? [] : [Number(v)],
            })
          }
          options={STAR_RATING_OPTIONS.map((option) => ({
            value: option,
            label: option === "any" ? t("search.any") : t("search.starsN", { n: option }),
          }))}
        />

        <FilterSelect
          label={t("search.roomType")}
          value={filters.roomType}
          onChange={(v) => onUpdate({ roomType: v as RoomType | "any" })}
          options={ROOM_TYPE_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`search.room.${option.value}`),
          }))}
        />

        <FilterSelect
          label={t("search.maxOccupancy")}
          value={String(filters.maxOccupancy)}
          onChange={(v) =>
            onUpdate({
              maxOccupancy: (v === "any" ? "any" : v === "5" ? 5 : Number(v)) as FilterState["maxOccupancy"],
            })
          }
          options={COUNT_OPTIONS.map((option) => ({
            value: option === "5+" ? "5" : option,
            label: option === "any" ? t("search.any") : option,
          }))}
        />

        {mode === "rest" && (
          <FilterSelect
            label={t("search.slotDuration")}
            value={filters.slotDuration}
            onChange={(v) => onUpdate({ slotDuration: v as SlotDuration | "any" })}
            options={[
              { value: "any", label: t("search.any") },
              ...SLOT_DURATION_OPTIONS.map((duration) => ({
                value: duration,
                label: duration,
              })),
            ]}
          />
        )}
      </div>
    </div>
  );
}
