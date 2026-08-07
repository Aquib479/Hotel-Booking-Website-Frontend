import { useState } from "react";
import {
  Bath,
  BedDouble,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CigaretteOff,
  Coffee,
  CreditCard,
  Loader2,
  Maximize2,
  Users,
  Wifi,
  Wind,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency/format";
import { toSupportedCurrency } from "@/lib/currency/pricing";
import { useHotelStore } from "@/store";
import { cn } from "@/lib/utils";
import { iconForAmenityLabel } from "./PropertyHighlights";
import {
  buildDisplayRoomGroups,
  type DisplayRateOption,
  type DisplayRoomGroup,
} from "../utils/roomsRatesDisplay";

type RateFilter = "all" | "breakfast" | "refundable" | "nonrefundable";

const FILTERS: Array<{ id: RateFilter; label: string }> = [
  { id: "all", label: "All options" },
  { id: "breakfast", label: "Breakfast included" },
  { id: "refundable", label: "Free cancellation" },
];

const DEFAULT_VISIBLE_RATES = 2;

function matchesFilter(option: DisplayRateOption, filter: RateFilter) {
  if (filter === "all") return true;
  const board = option.boardBasisLabel.toLowerCase();
  if (filter === "breakfast") {
    return /breakfast|bb|half.?board|full.?board|all.?inclusive/.test(board);
  }
  if (filter === "refundable") return option.refundable;
  return !option.refundable;
}

function hasBreakfast(label: string) {
  return /breakfast|bb|half.?board|full.?board|all.?inclusive/i.test(label);
}

export function RoomsRatesPanel({
  fallbackImage,
  onReserve,
}: {
  fallbackImage?: string;
  /** Called when user taps Reserve — parent should navigate to checkout. */
  onReserve?: (recommendationId: string) => void;
}) {
  const { currency, format: formatCurrency } = useCurrency();
  const status = useHotelStore((s) => s.status);
  const error = useHotelStore((s) => s.error);
  const roomsRates = useHotelStore((s) => s.roomsRates);
  const selected = useHotelStore((s) => s.selected);
  const [filter, setFilter] = useState<RateFilter>("all");

  const formatRoomPrice = (amount: number, fromCurrency?: string) => {
    const from = toSupportedCurrency(fromCurrency);
    if (from === currency) return formatCurrency(amount);
    return formatPrice(amount, from);
  };

  const groups = buildDisplayRoomGroups(roomsRates);
  const filteredGroups = groups
    .map((group) => ({
      ...group,
      options: group.options.filter((o) => matchesFilter(o, filter)),
    }))
    .filter((g) => g.options.length > 0);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border bg-white px-4 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Loading rooms &amp; rates…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-8 text-sm text-red-600">
        {error ?? "Failed to load rooms and rates"}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-8 text-sm text-muted-foreground">
        No room rates available for these dates.
      </div>
    );
  }

  return (
    <div id="hotel-rooms" className="scroll-mt-28 space-y-5">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Select your room
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Compare choices, sleeps, and today&apos;s price side by side.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
              filter === item.id
                ? "border-brand bg-brand text-white shadow-sm"
                : "border-border bg-white text-foreground hover:border-brand/35",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {filteredGroups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-8 text-center text-sm text-muted-foreground">
          No rates match this filter. Try another option.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredGroups.map((group) => (
            <RoomGroupCard
              key={group.key}
              group={group}
              selectedId={selected?.recommendationId}
              fallbackImage={fallbackImage}
              formatRoomPrice={formatRoomPrice}
              onSelect={(recommendationId) => onReserve?.(recommendationId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RoomGroupCard({
  group,
  selectedId,
  fallbackImage,
  formatRoomPrice,
  onSelect,
}: {
  group: DisplayRoomGroup;
  selectedId?: string | null;
  fallbackImage?: string;
  formatRoomPrice: (amount: number, currency?: string) => string;
  onSelect: (recommendationId: string) => void;
}) {
  const [showAllRates, setShowAllRates] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = group.images.length
    ? group.images
    : fallbackImage
      ? [fallbackImage]
      : [];
  const photo = photos[photoIndex] ?? photos[0];
  const visibleOptions = showAllRates
    ? group.options
    : group.options.slice(0, DEFAULT_VISIBLE_RATES);
  const hiddenCount = Math.max(0, group.options.length - DEFAULT_VISIBLE_RATES);
  const cheapestHidden = group.options[DEFAULT_VISIBLE_RATES];

  const facilityItems = buildRoomFacilityRows(group);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <h4 className="text-lg font-semibold text-foreground">
          {group.roomName}
        </h4>
      </div>

      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Left: room media + facts */}
        <div className="space-y-3 border-b border-border p-4 lg:border-b-0 lg:border-r sm:p-4">
          <div className="relative overflow-hidden rounded-xl bg-muted">
            {photo ? (
              <img
                src={photo}
                alt={group.roomName}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center">
                <BedDouble className="size-8 text-muted-foreground" />
              </div>
            )}

            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  onClick={() =>
                    setPhotoIndex((i) => (i <= 0 ? photos.length - 1 : i - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  onClick={() =>
                    setPhotoIndex((i) => (i >= photos.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <ChevronRight className="size-4" />
                </button>
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  <Camera className="size-3" />
                  {photos.length}
                </span>
              </>
            ) : null}
          </div>

          {group.bedSummary ? (
            <p className="flex items-center gap-2 text-sm text-foreground">
              <BedDouble className="size-4 shrink-0 text-muted-foreground" />
              {group.bedSummary}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {facilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-1.5"
                >
                  <Icon className="size-3.5 shrink-0" strokeWidth={1.75} />
                  <span className="truncate">{item.label}</span>
                </span>
              );
            })}
          </div>

          {(group.description || facilityItems.length > 0) && (
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="text-sm font-medium text-brand hover:underline"
            >
              {showDetails ? "Hide details" : "Room Details"}
            </button>
          )}

          {showDetails && group.description ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {group.description}
            </p>
          ) : null}
        </div>

        {/* Right: rate comparison table */}
        <div className="min-w-0">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_72px_minmax(120px,1fr)_104px] gap-3 border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>Your choices</span>
            <span className="text-center">Sleeps</span>
            <span className="text-right">Today&apos;s price</span>
            <span />
          </div>

          <div className="divide-y divide-border">
            {visibleOptions.map((option, optionIndex) => (
              <RateOptionRow
                key={option.recommendationId}
                option={option}
                isBest={optionIndex === 0}
                maxGuests={group.maxGuests}
                isSelected={selectedId === option.recommendationId}
                formatRoomPrice={formatRoomPrice}
                onSelect={() => onSelect(option.recommendationId)}
              />
            ))}
          </div>

          {hiddenCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowAllRates((v) => !v)}
              className="flex w-full items-center justify-center gap-1 border-t border-border px-4 py-3 text-sm font-medium text-brand hover:bg-brand/[0.03]"
            >
              {showAllRates ? (
                <>
                  Show fewer rates
                  <ChevronDown className="size-4 rotate-180" />
                </>
              ) : (
                <>
                  Show {hiddenCount} more room rate
                  {hiddenCount === 1 ? "" : "s"}
                  {cheapestHidden
                    ? ` (from ${formatRoomPrice(cheapestHidden.totalRate, cheapestHidden.currency)})`
                    : ""}
                  <ChevronDown className="size-4" />
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function RateOptionRow({
  option,
  isBest,
  maxGuests,
  isSelected,
  formatRoomPrice,
  onSelect,
}: {
  option: DisplayRateOption;
  isBest: boolean;
  maxGuests?: number;
  isSelected: boolean;
  formatRoomPrice: (amount: number, currency?: string) => string;
  onSelect: () => void;
}) {
  const breakfast = hasBreakfast(option.boardBasisLabel);
  const sleeps = Math.min(Math.max(maxGuests ?? 2, 1), 4);

  return (
    <div
      className={cn(
        "grid gap-3 px-4 py-4 transition sm:grid-cols-[minmax(0,1.4fr)_72px_minmax(120px,1fr)_104px] sm:items-center",
        isSelected && "bg-brand/[0.04]",
      )}
    >
      <div className="min-w-0 space-y-2">
        {isBest ? (
          <span
            className={cn(
              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
              breakfast
                ? "bg-emerald-50 text-emerald-800"
                : "bg-amber-50 text-amber-800",
            )}
          >
            {breakfast ? "Best price with breakfast" : "Today's best price"}
          </span>
        ) : breakfast ? (
          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            Includes breakfast
          </span>
        ) : null}

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li
            className={cn(
              "flex items-start gap-2",
              breakfast && "text-emerald-700",
            )}
          >
            <Coffee className="mt-0.5 size-3.5 shrink-0" />
            {option.boardBasisLabel || "Room only"}
          </li>
          <li
            className={cn(
              "flex items-start gap-2",
              option.refundable && "text-emerald-700",
            )}
          >
            {option.refundable ? (
              <Check className="mt-0.5 size-3.5 shrink-0" />
            ) : (
              <XCircle className="mt-0.5 size-3.5 shrink-0" />
            )}
            {option.refundable ? "Free cancellation" : "Non-refundable"}
          </li>
          <li className="flex items-start gap-2 text-emerald-700">
            <Zap className="mt-0.5 size-3.5 shrink-0" />
            Instant confirmation
          </li>
          {option.cancellationText ? (
            <li className="line-clamp-2 text-xs">{option.cancellationText}</li>
          ) : null}
        </ul>
      </div>

      <div className="flex items-center gap-1 sm:justify-center">
        <span className="text-xs font-medium text-muted-foreground sm:hidden">
          Sleeps
        </span>
        {Array.from({ length: sleeps }).map((_, i) => (
          <Users key={i} className="size-4 text-foreground" />
        ))}
      </div>

      <div className="sm:text-right">
        <p className="text-xl font-bold tracking-tight text-brand">
          {formatRoomPrice(option.totalRate, option.currency)}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Total for stay · taxes may apply
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full sm:w-auto"
        onClick={onSelect}
      >
        Reserve
      </Button>
    </div>
  );
}

function buildRoomFacilityRows(
  group: DisplayRoomGroup,
): Array<{ label: string; icon: LucideIcon }> {
  const rows: Array<{ label: string; icon: LucideIcon }> = [];

  if (group.areaSqm) {
    rows.push({ label: `${Math.round(group.areaSqm)} m²`, icon: Maximize2 });
  }

  rows.push({ label: "Non-smoking", icon: CigaretteOff });

  const fromApi = group.facilities.map((label) => ({
    label,
    icon: iconForAmenityLabel(label),
  }));

  const defaults: Array<{ label: string; icon: LucideIcon; match: RegExp }> = [
    { label: "Free Wi-Fi", icon: Wifi, match: /wifi|wi-?fi/i },
    { label: "Private bathroom", icon: Bath, match: /bath/i },
    { label: "Air conditioning", icon: Wind, match: /air|ac|cooling/i },
  ];

  for (const d of defaults) {
    if (fromApi.some((f) => d.match.test(f.label))) continue;
    if (rows.some((r) => d.match.test(r.label))) continue;
    rows.push({ label: d.label, icon: d.icon });
  }

  for (const f of fromApi) {
    if (rows.some((r) => r.label.toLowerCase() === f.label.toLowerCase()))
      continue;
    rows.push(f);
    if (rows.length >= 7) break;
  }

  return rows.slice(0, 7);
}
