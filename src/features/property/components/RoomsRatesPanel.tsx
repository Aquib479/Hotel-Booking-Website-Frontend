import { useState } from "react";
import {
  BedDouble,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cigarette,
  CigaretteOff,
  Coffee,
  CreditCard,
  Eye,
  Loader2,
  Maximize2,
  ParkingSquare,
  Tag,
  Users,
  Wifi,
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
import { useLanguage } from "@/context/LanguageContext";
import { hasMessage } from "@/lib/i18n/messages";
import { iconForAmenityLabel } from "./PropertyHighlights";
import {
  buildDisplayRoomGroups,
  type DisplayRateOption,
  type DisplayRoomGroup,
} from "../utils/roomsRatesDisplay";

/** Filters derived from rooms/rates payload — only shown when options exist. */
type RoomFilterId =
  | "breakfast"
  | "roomOnly"
  | "refundable"
  | "parking"
  | "wifi"
  | "payAtHotel"
  | "deal"
  | "cityView"
  | "twinBed"
  | "doubleBed"
  | "nonSmoking";

type RoomFilterDef = {
  id: RoomFilterId;
  label: string;
  /** Rate-level vs room-level */
  scope: "rate" | "room";
};

const FILTER_DEFS: RoomFilterDef[] = [
  { id: "breakfast", label: "Breakfast included", scope: "rate" },
  { id: "roomOnly", label: "Room only", scope: "rate" },
  { id: "refundable", label: "Free cancellation", scope: "rate" },
  { id: "parking", label: "Free parking", scope: "rate" },
  { id: "wifi", label: "Free WiFi", scope: "rate" },
  { id: "payAtHotel", label: "Pay at hotel", scope: "rate" },
  { id: "deal", label: "Deals & promotions", scope: "rate" },
  { id: "cityView", label: "City view", scope: "room" },
  { id: "twinBed", label: "Twin beds", scope: "room" },
  { id: "doubleBed", label: "Double / Queen", scope: "room" },
  { id: "nonSmoking", label: "Non-smoking", scope: "room" },
];

const DEFAULT_VISIBLE_RATES = 2;
const PREVIEW_FACILITY_COUNT = 8;

function hasBreakfast(label: string) {
  return /breakfast|bb|half.?board|full.?board|all.?inclusive/i.test(label);
}

function isRoomOnly(option: DisplayRateOption) {
  const type = (option.boardBasisType ?? "").toLowerCase();
  if (type === "roomonly") return true;
  const label = option.boardBasisLabel.toLowerCase();
  return /room\s*only|roomonly/.test(label) && !hasBreakfast(label);
}

function includesMatch(option: DisplayRateOption, pattern: RegExp) {
  return option.includes.some((item) => pattern.test(item));
}

function isTwinBed(group: DisplayRoomGroup) {
  const text = `${group.bedSummary ?? ""} ${group.roomName}`.toLowerCase();
  return /twin/.test(text);
}

function isDoubleBed(group: DisplayRoomGroup) {
  const text = `${group.bedSummary ?? ""} ${group.roomName}`.toLowerCase();
  return /queen|king|double/.test(text) && !/twin/.test(text);
}

function hasCityView(group: DisplayRoomGroup) {
  return group.views.some((v) => /city|view/i.test(v));
}

function matchesRateFilter(option: DisplayRateOption, id: RoomFilterId) {
  switch (id) {
    case "breakfast":
      return hasBreakfast(option.boardBasisLabel) || includesMatch(option, /breakfast/i);
    case "roomOnly":
      return isRoomOnly(option);
    case "refundable":
      return option.refundable;
    case "parking":
      return includesMatch(option, /park/i);
    case "wifi":
      return includesMatch(option, /wifi|wi-?fi/i);
    case "payAtHotel":
      return option.payAtHotel === true;
    case "deal":
      return option.offers.length > 0;
    default:
      return true;
  }
}

function matchesRoomFilter(group: DisplayRoomGroup, id: RoomFilterId) {
  switch (id) {
    case "cityView":
      return hasCityView(group);
    case "twinBed":
      return isTwinBed(group);
    case "doubleBed":
      return isDoubleBed(group);
    case "nonSmoking":
      return group.smokingAllowed === false;
    default:
      return true;
  }
}

function optionMatchesActiveFilters(
  group: DisplayRoomGroup,
  option: DisplayRateOption,
  active: Set<RoomFilterId>,
) {
  if (active.size === 0) return true;
  for (const id of active) {
    const def = FILTER_DEFS.find((f) => f.id === id);
    if (!def) continue;
    if (def.scope === "rate" && !matchesRateFilter(option, id)) return false;
    if (def.scope === "room" && !matchesRoomFilter(group, id)) return false;
  }
  return true;
}

/** Only expose chips that meaningfully narrow results for this hotel. */
function availableFilters(groups: DisplayRoomGroup[]): RoomFilterDef[] {
  if (!groups.length) return [];

  return FILTER_DEFS.filter((def) => {
    if (def.scope === "room") {
      const matchCount = groups.filter((g) => matchesRoomFilter(g, def.id)).length;
      return matchCount > 0 && matchCount < groups.length;
    }

    let matchCount = 0;
    let total = 0;
    for (const group of groups) {
      for (const option of group.options) {
        total += 1;
        if (matchesRateFilter(option, def.id)) matchCount += 1;
      }
    }
    return matchCount > 0 && matchCount < total;
  });
}

export function RoomsRatesPanel({
  fallbackImage,
  onReserve,
}: {
  fallbackImage?: string;
  /** Called when user taps Reserve — parent should navigate to checkout. */
  onReserve?: (recommendationId: string) => void;
}) {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const status = useHotelStore((s) => s.status);
  const error = useHotelStore((s) => s.error);
  const roomsRates = useHotelStore((s) => s.roomsRates);
  const selected = useHotelStore((s) => s.selected);
  const [activeFilters, setActiveFilters] = useState<Set<RoomFilterId>>(
    () => new Set(),
  );

  const formatRoomPrice = (amount: number, fromCurrency?: string) => {
    // Always format in the rate's API currency — never client-side FX.
    return formatPrice(amount, toSupportedCurrency(fromCurrency || currency));
  };

  const groups = buildDisplayRoomGroups(roomsRates);
  const filters = availableFilters(groups);

  const toggleFilter = (id: RoomFilterId) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => setActiveFilters(new Set());

  const filteredGroups = groups
    .map((group) => ({
      ...group,
      options: group.options.filter((o) =>
        optionMatchesActiveFilters(group, o, activeFilters),
      ),
    }))
    .filter((g) => g.options.length > 0);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-border bg-white px-4 py-10 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t("hotel.loadingRooms")}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-md border border-dashed border-border bg-white px-4 py-8 text-sm text-red-600">
        {error ? t(error) : t("hotel.loadRoomsFail")}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-md border border-dashed border-border bg-white px-4 py-8 text-sm text-muted-foreground">
        {t("hotel.noRates")}
      </div>
    );
  }

  return (
    <div id="hotel-rooms" className="scroll-mt-28 space-y-5">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          {t("hotel.selectRoom")}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("hotel.compareHint")}
        </p>
      </div>

      {filters.length > 0 ? (
        <div className="space-y-2">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={clearFilters}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                activeFilters.size === 0
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-border bg-white text-foreground hover:border-brand/35",
              )}
            >
              {t("hotel.allOptions")}
            </button>
            {filters.map((item) => {
              const on = activeFilters.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleFilter(item.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition",
                    on
                      ? "border-brand bg-brand text-white shadow-sm"
                      : "border-border bg-white text-foreground hover:border-brand/35",
                  )}
                >
                  {t(`hotel.filter.${item.id}`)}
                </button>
              );
            })}
          </div>
          {activeFilters.size > 0 ? (
            <p className="text-xs text-muted-foreground">
              {groups.length === 1
                ? t("hotel.showingRoomOne", {
                    shown: filteredGroups.length,
                    total: groups.length,
                  })
                : t("hotel.showingRooms", {
                    shown: filteredGroups.length,
                    total: groups.length,
                  })}
              {" · "}
              <button
                type="button"
                onClick={clearFilters}
                className="font-medium text-brand hover:underline"
              >
                {t("hotel.clearFilters")}
              </button>
            </p>
          ) : null}
        </div>
      ) : null}

      {filteredGroups.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-white px-4 py-8 text-center text-sm text-muted-foreground">
          {t("hotel.noMatchFilters")}{" "}
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-brand hover:underline"
          >
            {t("hotel.clearFilters")}
          </button>
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
  const { t } = useLanguage();
  const [showAllRates, setShowAllRates] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const photos = group.images.length
    ? group.images
    : fallbackImage
      ? [fallbackImage]
      : [];
  const photo = photos[photoIndex] ?? photos[0];
  const photoCaption =
    group.images.length > 0
      ? group.imageCaptions[photoIndex] || group.imageCaptions[0]
      : undefined;
  const visibleOptions = showAllRates
    ? group.options
    : group.options.slice(0, DEFAULT_VISIBLE_RATES);
  const hiddenCount = Math.max(0, group.options.length - DEFAULT_VISIBLE_RATES);
  const cheapestHidden = group.options[DEFAULT_VISIBLE_RATES];

  const facilityItems = buildRoomFacilityRows(group, t);
  const occupancyBits = [
    group.maxGuests ? t("hotel.sleepsN", { n: group.maxGuests }) : null,
    group.maxAdults != null ? t("hotel.adultsN", { n: group.maxAdults }) : null,
    group.maxChildren != null && group.maxChildren > 0
      ? t("hotel.childrenN", { n: group.maxChildren })
      : null,
  ].filter(Boolean);

  return (
    <article className="overflow-hidden rounded-md border border-border bg-white shadow-sm">
      <div className="border-b border-border px-4 py-3.5 sm:px-5">
        <h4 className="text-lg font-semibold text-foreground">
          {group.roomName}
        </h4>
        {group.roomTypeLabel && group.roomTypeLabel !== group.roomName ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {group.roomTypeLabel}
            {occupancyBits.length ? ` · ${occupancyBits.join(" · ")}` : ""}
          </p>
        ) : occupancyBits.length ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {occupancyBits.join(" · ")}
          </p>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-3 border-b border-border p-4 lg:border-b-0 lg:border-r sm:p-4">
          <div className="relative overflow-hidden rounded-md bg-muted">
            {photo ? (
              <img
                src={photo}
                alt={photoCaption || group.roomName}
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
                  aria-label={t("hotel.prevPhoto")}
                  onClick={() =>
                    setPhotoIndex((i) => (i <= 0 ? photos.length - 1 : i - 1))
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={t("hotel.nextPhoto")}
                  onClick={() =>
                    setPhotoIndex((i) => (i >= photos.length - 1 ? 0 : i + 1))
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/45 p-1 text-white backdrop-blur-sm transition hover:bg-black/60"
                >
                  <ChevronRight className="size-4" />
                </button>
                <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  <Camera className="size-3" />
                  {photoIndex + 1}/{photos.length}
                </span>
              </>
            ) : null}

            {photoCaption ? (
              <span className="absolute bottom-2 left-2 max-w-[60%] truncate rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] text-white">
                {photoCaption}
              </span>
            ) : null}
          </div>

          {group.bedSummary ? (
            <p className="flex items-center gap-2 text-sm text-foreground">
              <BedDouble className="size-4 shrink-0 text-muted-foreground" />
              {group.bedSummary}
            </p>
          ) : null}

          {group.views.length > 0 ? (
            <p className="flex items-center gap-2 text-sm text-foreground">
              <Eye className="size-4 shrink-0 text-muted-foreground" />
              {group.views.join(", ")}
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

          {(group.description ||
            group.facilities.length > 0 ||
            group.views.length > 0) && (
            <button
              type="button"
              onClick={() => setShowDetails((v) => !v)}
              className="text-sm font-medium text-brand hover:underline"
            >
              {showDetails ? t("hotel.hideDetails") : t("hotel.roomDetails")}
            </button>
          )}

          {showDetails ? (
            <div className="space-y-3 border-t border-border/70 pt-3">
              {group.description ? (
                <p className="whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                  {group.description}
                </p>
              ) : null}

              {group.facilities.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("hotel.roomFacilities")}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {group.facilities.map((facility) => (
                      <li
                        key={facility}
                        className="flex items-start gap-2 text-xs text-foreground"
                      >
                        <Check className="mt-0.5 size-3 shrink-0 text-emerald-600" />
                        {hasMessage(`search.amenity.${facility}`)
                          ? t(`search.amenity.${facility}`)
                          : facility}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="hidden grid-cols-[minmax(0,1.4fr)_72px_minmax(120px,1fr)_104px] gap-3 border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span>{t("hotel.yourChoices")}</span>
            <span className="text-center">{t("hotel.sleepsHeader")}</span>
            <span className="text-right">{t("hotel.totalStay")}</span>
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
                  {t("hotel.showFewerRates")}
                  <ChevronDown className="size-4 rotate-180" />
                </>
              ) : (
                <>
                  {hiddenCount === 1
                    ? t("hotel.showMoreRate", { n: hiddenCount })
                    : t("hotel.showMoreRates", { n: hiddenCount })}
                  {cheapestHidden
                    ? ` ${t("hotel.fromPrice", {
                        price: formatRoomPrice(cheapestHidden.totalRate, cheapestHidden.currency),
                      })}`
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
  const { t } = useLanguage();
  const [showPolicies, setShowPolicies] = useState(false);
  const breakfast = hasBreakfast(option.boardBasisLabel);
  const sleeps = Math.min(Math.max(maxGuests ?? 2, 1), 4);
  const showPublished =
    option.publishedRate != null &&
    option.publishedRate > option.totalRate + 0.5;
  const includeIcons: Array<{ match: RegExp; icon: LucideIcon }> = [
    { match: /wifi|wi-?fi/i, icon: Wifi },
    { match: /park/i, icon: ParkingSquare },
    { match: /breakfast/i, icon: Coffee },
  ];

  return (
    <div
      className={cn(
        "grid gap-3 px-4 py-4 transition sm:grid-cols-[minmax(0,1.4fr)_72px_minmax(120px,1fr)_104px] sm:items-start",
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
            {breakfast ? t("hotel.bestBreakfast") : t("hotel.todaysBest")}
          </span>
        ) : breakfast ? (
          <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
            {t("hotel.includesBreakfast")}
          </span>
        ) : null}

        {option.offers.map((offer) => (
          <span
            key={`${offer.title}-${offer.description}`}
            className="mr-1.5 inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-800"
          >
            <Tag className="size-3" />
            {[offer.title, offer.description].filter(Boolean).join(" · ")}
          </span>
        ))}

        <ul className="space-y-1.5 text-sm text-muted-foreground">
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
            {option.refundable
              ? t("search.amenity.Free cancellation")
              : option.refundability?.replace(/([a-z])([A-Z])/g, "$1 $2") ||
                t("hotel.nonRefundable")}
          </li>

          {option.includes.map((item) => {
            const Icon =
              includeIcons.find((i) => i.match.test(item))?.icon ?? Check;
            return (
              <li
                key={item}
                className="flex items-start gap-2 text-emerald-700"
              >
                <Icon className="mt-0.5 size-3.5 shrink-0" />
                {hasMessage(`search.amenity.${item}`)
                  ? t(`search.amenity.${item}`)
                  : item}
              </li>
            );
          })}

          <li className="flex items-start gap-2 text-emerald-700">
            <Zap className="mt-0.5 size-3.5 shrink-0" />
            {option.needsPriceCheck
              ? t("hotel.instantConfirmCheck")
              : t("hotel.instantConfirm")}
          </li>

          {option.payAtHotel === false ? (
            <li className="flex items-start gap-2">
              <CreditCard className="mt-0.5 size-3.5 shrink-0" />
              {option.cardRequired
                ? t("hotel.payOnlineCard")
                : t("hotel.payOnline")}
            </li>
          ) : option.payAtHotel ? (
            <li className="flex items-start gap-2">
              <CreditCard className="mt-0.5 size-3.5 shrink-0" />
              {t("search.payAtHotel")}
            </li>
          ) : null}

          {option.specialRequestSupported ? (
            <li className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0" />
              {t("hotel.specialRequests")}
            </li>
          ) : null}

          {option.availability != null && option.availability <= 5 ? (
            <li className="text-xs font-medium text-amber-700">
              {t("hotel.onlyLeft", { n: option.availability })}
            </li>
          ) : null}

          {option.cancellationText ? (
            <li className="line-clamp-2 text-xs">{option.cancellationText}</li>
          ) : null}
        </ul>

        {option.policies.length > 0 ? (
          <div>
            <button
              type="button"
              onClick={() => setShowPolicies((v) => !v)}
              className="text-xs font-medium text-brand hover:underline"
            >
              {showPolicies ? t("hotel.hidePolicies") : t("hotel.viewPolicies")}
            </button>
            {showPolicies ? (
              <div className="mt-2 space-y-2 rounded-lg border border-border/70 bg-muted/30 p-2.5">
                {option.policies.map((policy) => (
                  <div key={policy.type}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {policy.type}
                    </p>
                    <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-foreground">
                      {policy.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-1 sm:justify-center sm:pt-1">
        <span className="text-xs font-medium text-muted-foreground sm:hidden">
          {t("hotel.sleepsHeader")}
        </span>
        {Array.from({ length: sleeps }).map((_, i) => (
          <Users key={i} className="size-4 text-foreground" />
        ))}
      </div>

      <div className="sm:pt-0.5 sm:text-right">
        {showPublished ? (
          <p className="text-xs text-muted-foreground line-through">
            {formatRoomPrice(option.publishedRate!, option.currency)}
          </p>
        ) : null}
        <p className="text-xl font-bold tracking-tight text-brand">
          {formatRoomPrice(option.totalRate, option.currency)}
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {t("hotel.totalForStay")}
          {option.taxesAmount != null && option.taxesAmount > 0
            ? ` · ${t("hotel.taxesAmount", {
                amount: formatRoomPrice(option.taxesAmount, option.currency),
              })}`
            : ` · ${t("hotel.taxesMayApply")}`}
        </p>
        {option.baseRate != null && option.baseRate > 0 ? (
          <p className="text-[11px] text-muted-foreground">
            {t("hotel.baseAmount", {
              amount: formatRoomPrice(option.baseRate, option.currency),
            })}
          </p>
        ) : null}
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full sm:w-auto rounded-md"
        onClick={onSelect}
      >
        {t("hotel.reserve")}
      </Button>
    </div>
  );
}

function buildRoomFacilityRows(
  group: DisplayRoomGroup,
  t: (key: string) => string,
): Array<{ label: string; icon: LucideIcon }> {
  const rows: Array<{ label: string; icon: LucideIcon }> = [];

  if (group.areaLabel) {
    rows.push({ label: group.areaLabel, icon: Maximize2 });
  } else if (group.areaSqm) {
    rows.push({ label: `${Math.round(group.areaSqm)} m²`, icon: Maximize2 });
  }

  if (group.smokingAllowed === false) {
    rows.push({ label: t("hotel.nonSmoking"), icon: CigaretteOff });
  } else if (group.smokingAllowed === true) {
    rows.push({ label: t("hotel.smokingAllowed"), icon: Cigarette });
  }

  const fromApi = group.facilities.map((label) => {
    const key = `search.amenity.${label}`;
    return {
      label: hasMessage(key) ? t(key) : label,
      icon: iconForAmenityLabel(label),
    };
  });

  for (const f of fromApi) {
    if (rows.some((r) => r.label.toLowerCase() === f.label.toLowerCase())) {
      continue;
    }
    rows.push(f);
    if (rows.length >= PREVIEW_FACILITY_COUNT) break;
  }

  return rows.slice(0, PREVIEW_FACILITY_COUNT);
}
