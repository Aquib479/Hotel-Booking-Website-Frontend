import { Link } from "react-router-dom";
import { Heart, Plane, Star } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  mode: "rest" | "stay";
  nights: number;
  searchParams?: string;
  compact?: boolean;
}

export function PropertyCard({
  property,
  mode,
  nights,
  searchParams,
  compact = false,
}: PropertyCardProps) {
  const isFavorite = useFavoritesStore((s) => Boolean(s.items[property.id]));
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isDirect = property.lane === "direct";
  const detailUrl = `/properties/${property.id}${searchParams ? `?${searchParams}` : ""}`;

  return (
    <Card
      padding="none"
      className={cn(
        "group relative overflow-hidden transition-shadow hover:shadow-md",
        compact && "rounded-xl"
      )}
    >
      <Link to={detailUrl} className="block">
        <div
          className={cn(
            "relative overflow-hidden",
            compact ? "aspect-[5/3]" : "aspect-[4/3]"
          )}
        >
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div
            className={cn(
              "absolute inset-x-0 top-0 flex items-start justify-between",
              compact ? "p-2" : "p-3"
            )}
          >
            <div className="flex flex-col items-start gap-1">
              {!compact ? <LaneBadge lane={property.lane} /> : null}
              <div
                className={cn(
                  "flex items-center gap-1 rounded-full bg-white/95 font-semibold shadow-sm",
                  compact ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
                )}
              >
                <Star
                  className={cn(
                    "fill-amber-400 text-amber-400",
                    compact ? "size-2.5" : "size-3.5"
                  )}
                />
                {property.rating}
              </div>
            </div>
          </div>
        </div>

        <div className={cn(compact ? "space-y-1.5 p-2.5" : "space-y-3 p-4 sm:p-5")}>
          <div className={cn("flex gap-2", compact ? "flex-col" : "items-start justify-between gap-4")}>
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "font-semibold leading-snug text-foreground",
                  compact ? "line-clamp-1 text-sm" : "line-clamp-2"
                )}
              >
                {property.title}
              </h3>
              <p
                className={cn(
                  "text-muted-foreground",
                  compact ? "mt-0.5 line-clamp-1 text-[11px]" : "mt-1 line-clamp-1 text-sm"
                )}
              >
                {property.address}
              </p>
            </div>
            <div className={cn("shrink-0", compact ? "" : "text-right")}>
              <PriceDisplay
                lane={property.lane}
                priceUsd={property.priceUsd}
                priceIdr={property.priceIdr}
                wholesalePricing={property.wholesalePricing}
                priceAmount={property.priceAmount}
                priceCurrency={property.priceCurrency}
                mode={mode}
                slotDuration={property.slotDuration}
                className={compact ? "text-sm" : undefined}
              />
              {!compact && isDirect && property.nextAvailableSlot ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {property.nextAvailableSlot}
                </p>
              ) : null}
              {!compact && !isDirect && nights > 1 ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {nights} nights total
                </p>
              ) : null}
            </div>
          </div>

          {!compact ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {property.distanceFromAirportKm <= 15 &&
                property.distanceFromAirportKm > 0 && (
                  <span className="flex items-center gap-1">
                    <Plane className="size-3" />
                    {property.distanceFromAirportKm} km from airport
                  </span>
                )}
              <span>
                {property.starRating > 0
                  ? `${property.starRating}-star · ${property.roomType}`
                  : property.roomType}
              </span>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {property.starRating > 0
                ? `${property.starRating}-star · ${property.roomType}`
                : property.roomType}
            </p>
          )}
        </div>
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={isFavorite ? "Remove from favourites" : "Add to favourites"}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(property);
        }}
        className={cn(
          "absolute rounded-full bg-white/95 shadow-sm hover:bg-white",
          compact ? "right-1.5 top-1.5 size-7" : "right-3 top-3 size-9"
        )}
      >
        <Heart
          className={cn(
            compact ? "size-3.5" : "size-4",
            isFavorite ? "fill-red-500 text-red-500" : "text-foreground"
          )}
        />
      </Button>
    </Card>
  );
}
