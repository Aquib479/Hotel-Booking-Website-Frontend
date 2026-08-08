import { Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Coffee,
  Heart,
  Info,
  Leaf,
  MapPin,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  mode: "rest" | "stay";
  nights: number;
  searchParams?: string;
  /** Occupancy label from the search query (e.g. "2 Adults, 1 Child"). */
  guestsLabel?: string;
}

function reviewLabel(score: number): string {
  const normalized = score > 5 ? score : score * 2;
  if (normalized >= 9) return "Exceptional";
  if (normalized >= 8) return "Excellent";
  if (normalized >= 7) return "Very good";
  if (normalized >= 6) return "Good";
  if (normalized >= 5) return "Pleasant";
  return "Fair";
}

function formatReviewScore(score: number): string {
  if (!Number.isFinite(score) || score <= 0) return "";
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function StarRow({ rating }: { rating: number }) {
  if (!rating || rating <= 0) return null;
  const filled = Math.min(5, Math.max(0, Math.round(rating)));

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} star hotel`}>
      {Array.from({ length: filled }).map((_, index) => (
        <Star
          key={index}
          className="size-3.5 fill-amber-400 text-amber-400 drop-shadow-sm"
        />
      ))}
      <span className="ml-1.5 text-xs font-medium text-muted-foreground">
        {Number.isInteger(rating) ? rating : rating.toFixed(1)}
      </span>
    </div>
  );
}

function formatStayPrice(amount: number, currency?: string): string | null {
  if (!amount || amount <= 0 || !currency) return null;
  const code = currency.toUpperCase() as CurrencyCode;
  if (!CURRENCIES.some((c) => c.code === code)) {
    return `${code} ${Math.round(amount).toLocaleString("en-US")}`;
  }
  return formatPrice(amount, code);
}

function hasPriceBreakdownDetails(
  breakdown: NonNullable<Property["priceBreakdown"]>
): boolean {
  return Boolean(
    breakdown.baseRate ||
      breakdown.taxes ||
      breakdown.fees ||
      breakdown.discounts ||
      (breakdown.publishedRate ?? 0) > breakdown.totalRate
  );
}

function PriceBreakdownTooltip({
  breakdown,
  currency,
  nights,
}: {
  breakdown: NonNullable<Property["priceBreakdown"]>;
  currency?: string;
  nights: number;
}) {
  const [open, setOpen] = useState(false);
  const savings =
    (breakdown.publishedRate ?? 0) > breakdown.totalRate
      ? (breakdown.publishedRate ?? 0) - breakdown.totalRate
      : 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="View price breakdown"
          className={cn(
            "inline-flex size-4 shrink-0 items-center justify-center rounded-full",
            "border border-muted-foreground/40 text-muted-foreground",
            "transition-colors hover:border-brand hover:text-brand",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          <Info className="size-2.5" strokeWidth={2.5} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-64 p-3"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <PopoverHeader className="mb-2 gap-0.5">
          <PopoverTitle className="text-sm">Price breakdown</PopoverTitle>
          {nights > 1 ? (
            <p className="text-xs text-muted-foreground">{nights} nights total</p>
          ) : null}
        </PopoverHeader>
        <ul className="space-y-1.5">
          {breakdown.baseRate ? (
            <li className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Base rate</span>
              <span className="tabular-nums font-medium">
                {formatStayPrice(breakdown.baseRate, currency)}
              </span>
            </li>
          ) : null}
          {breakdown.taxes ? (
            <li className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Taxes</span>
              <span className="tabular-nums font-medium">
                {formatStayPrice(breakdown.taxes, currency)}
              </span>
            </li>
          ) : null}
          {breakdown.fees ? (
            <li className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Fees</span>
              <span className="tabular-nums font-medium">
                {formatStayPrice(breakdown.fees, currency)}
              </span>
            </li>
          ) : null}
          {breakdown.discounts ? (
            <li className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">Discounts</span>
              <span className="tabular-nums font-medium text-emerald-700">
                −{formatStayPrice(breakdown.discounts, currency)}
              </span>
            </li>
          ) : null}
          {savings > 0 ? (
            <li className="flex items-center justify-between gap-3 text-xs">
              <span className="text-emerald-700">You save</span>
              <span className="tabular-nums font-semibold text-emerald-700">
                {formatStayPrice(savings, currency)}
              </span>
            </li>
          ) : null}
          <li className="flex items-center justify-between gap-3 border-t border-border/70 pt-1.5 text-xs">
            <span className="font-semibold">Total</span>
            <span className="tabular-nums font-bold">
              {formatStayPrice(breakdown.totalRate, currency)}
            </span>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function AmenityIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  if (key.includes("breakfast") || key.includes("coffee")) {
    return <Coffee className="size-3 opacity-70" aria-hidden />;
  }
  if (key.includes("wifi")) {
    return <span className="text-[10px] font-bold opacity-70" aria-hidden>Wi</span>;
  }
  return null;
}

export function PropertyCard({
  property,
  mode,
  nights,
  searchParams,
  guestsLabel,
}: PropertyCardProps) {
  const isFavorite = useFavoritesStore((s) => Boolean(s.items[property.id]));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const detailUrl = `/properties/${property.id}${searchParams ? `?${searchParams}` : ""}`;

  const showFreeCancellation =
    property.freeCancellation ||
    property.refundable ||
    property.amenities.includes("Free cancellation");

  const amenityPills =
    property.amenityPills?.length > 0
      ? property.amenityPills
      : (property.amenities ?? []).filter((a) => a !== "Free cancellation").slice(0, 4);

  const boardBasisShown =
    Boolean(property.boardBasisLabel) &&
    !amenityPills.some((p) =>
      p.toLowerCase().includes(
        property.boardBasisLabel!.toLowerCase().includes("breakfast")
          ? "breakfast"
          : property.boardBasisLabel!.toLowerCase()
      )
    );

  const totalPriceLabel = formatStayPrice(
    property.totalStayAmount ?? 0,
    property.priceCurrency
  );
  const publishedPriceLabel = formatStayPrice(
    property.publishedStayAmount ?? 0,
    property.priceCurrency
  );
  const hasReviews = property.rating > 0;
  const occupancyLabel =
    guestsLabel
      ?.replace(/\s*·\s*\d+\s*Rooms?/i, "")
      .trim() || null;
  const locationLabel = property.city || property.address || null;
  const hasDiscount = Boolean(publishedPriceLabel && totalPriceLabel);
  const showBreakdown =
    Boolean(property.priceBreakdown) &&
    hasPriceBreakdownDetails(property.priceBreakdown!);

  return (
    <Card
      padding="none"
      className={cn(
        "group/card relative overflow-hidden rounded-md border border-border/70 bg-white",
        "shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]",
        "transition-all duration-300 ease-out",
        "hover:border-brand/25",
        "hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)]"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Image */}
        <Link
          to={detailUrl}
          className="relative block w-full shrink-0 overflow-hidden sm:min-h-[220px] sm:w-[260px] md:w-[288px]"
          aria-label={`View ${property.title}`}
        >
          {/* Mobile: fixed aspect. Desktop: stretches to match card height. */}
          <div className="relative aspect-[16/11] w-full sm:absolute sm:inset-0 sm:aspect-auto">
            <img
              src={property.image}
              alt={property.title}
              className="size-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-80 transition-opacity duration-300 group-hover/card:opacity-90"
              aria-hidden
            />

            {property.offerLabel ? (
              <span className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1.5 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
                <BadgePercent className="size-3.5 shrink-0" aria-hidden />
                <span className="truncate">{property.offerLabel}</span>
              </span>
            ) : null}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property);
            }}
            className={cn(
              "absolute right-3 top-3 size-9 rounded-full border border-white/70 bg-white/95 shadow-md backdrop-blur-sm",
              "transition-transform duration-200 hover:scale-110 hover:bg-white",
              isFavorite && "border-red-100 bg-red-50"
            )}
          >
            <Heart
              className={cn(
                "size-4 transition-transform duration-200",
                isFavorite
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-slate-700"
              )}
            />
          </Button>
        </Link>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:justify-between sm:gap-0 sm:p-0">
          <Link
            to={detailUrl}
            className="min-w-0 flex-1 space-y-3 sm:px-5 sm:py-5"
          >
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors duration-200 group-hover/card:text-brand sm:text-xl">
                {property.title}
              </h3>
              <StarRow rating={property.starRating} />
              {locationLabel ? (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0 text-brand/70" aria-hidden />
                  <span className="line-clamp-1">{locationLabel}</span>
                </p>
              ) : null}
            </div>

            {amenityPills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {amenityPills.map((pill) => (
                  <span
                    key={pill}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-1",
                      "text-[11px] font-medium text-slate-700",
                      "transition-colors duration-200 group-hover/card:border-brand/20 group-hover/card:bg-brand/[0.04]"
                    )}
                  >
                    <AmenityIcon label={pill} />
                    {pill}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm">
              {showFreeCancellation ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-sky-700">
                  <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                  Free cancellation
                </span>
              ) : null}
              {boardBasisShown ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700">
                  <Coffee className="size-3.5 shrink-0" aria-hidden />
                  {property.boardBasisLabel}
                </span>
              ) : null}
              {property.payAtHotel ? (
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Wallet className="size-3.5 shrink-0" aria-hidden />
                  Pay at hotel
                </span>
              ) : null}
              {property.highlightAttributes?.map((attr) => (
                <span
                  key={attr}
                  className="inline-flex items-center gap-1.5 font-medium text-emerald-700"
                >
                  <Leaf className="size-3.5 shrink-0" aria-hidden />
                  {attr}
                </span>
              ))}
            </div>
          </Link>

          {/* Ratings + price + book */}
          <div
            className={cn(
              "flex shrink-0 flex-col items-end justify-between gap-4",
              "border-t border-dashed border-border/80 pt-4",
              "sm:w-[188px] sm:border-l sm:border-t-0 sm:bg-gradient-to-b sm:from-slate-50/80 sm:to-white sm:px-4 sm:py-5 sm:pt-5 md:w-[200px]"
            )}
          >
            {hasReviews ? (
              <div className="flex flex-row items-start justify-end gap-2.5">
                <div className="min-w-0 text-right">
                  <p className="truncate text-sm font-semibold leading-5 text-foreground">
                    {reviewLabel(property.rating)}
                  </p>
                  {property.reviewCount > 0 ? (
                    <p className="mt-0.5 text-xs leading-4 text-muted-foreground">
                      {property.reviewCount.toLocaleString()}{" "}
                      {property.reviewCount === 1 ? "rating" : "ratings"}
                    </p>
                  ) : null}
                </div>
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-lg",
                    "bg-violet-100 text-sm font-bold leading-none text-violet-700",
                    "transition-transform duration-300 group-hover/card:scale-105"
                  )}
                  aria-label={`Guest rating ${formatReviewScore(property.rating)}`}
                >
                  {formatReviewScore(property.rating)}
                </div>
              </div>
            ) : (
              <div className="hidden sm:block" />
            )}

            <div className="flex w-full flex-col items-end gap-3">
              <div className="w-full space-y-0.5 text-right">
                {hasDiscount ? (
                  <p className="text-xs font-medium text-muted-foreground line-through decoration-slate-400">
                    {publishedPriceLabel}
                  </p>
                ) : null}
                <div className="flex items-center justify-end gap-1.5">
                  {totalPriceLabel ? (
                    <p className="text-xl font-bold tracking-tight text-foreground tabular-nums">
                      {totalPriceLabel}
                    </p>
                  ) : (
                    <PriceDisplay
                      lane={property.lane}
                      priceUsd={property.priceUsd}
                      priceIdr={property.priceIdr}
                      wholesalePricing={property.wholesalePricing}
                      priceAmount={property.priceAmount}
                      priceCurrency={property.priceCurrency}
                      mode={mode}
                      slotDuration={property.slotDuration}
                      showUnit={false}
                      amountClassName="text-2xl tabular-nums"
                      className="justify-end"
                    />
                  )}
                  {showBreakdown && property.priceBreakdown ? (
                    <PriceBreakdownTooltip
                      breakdown={property.priceBreakdown}
                      currency={property.priceCurrency}
                      nights={nights}
                    />
                  ) : null}
                </div>
                {occupancyLabel ? (
                  <p className="mt-1 inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Users className="size-3 shrink-0" aria-hidden />
                    {occupancyLabel}
                  </p>
                ) : nights > 1 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {nights} nights total
                  </p>
                ) : null}
              </div>

              <Button
                asChild
                variant="brand"
                className={cn(
                  "group/book ml-auto h-10 min-w-30 rounded-md text-sm font-semibold",
                  "shadow-sm transition-all duration-200",
                  "hover:shadow-[0_8px_20px_rgba(124,58,237,0.28)]"
                )}
              >
                <Link to={detailUrl}>
                  Check Availability
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover/book:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
