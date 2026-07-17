import { Link } from "react-router-dom";
import { ExternalLink, Heart, Plane, Star, Zap } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Property } from "../types";

interface PropertyCardProps {
  property: Property;
  mode: "rest" | "stay";
  nights: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  searchParams?: string;
}

export function PropertyCard({
  property,
  mode,
  nights,
  isFavorite,
  onToggleFavorite,
  searchParams,
}: PropertyCardProps) {
  const isDirect = property.lane === "direct";
  const detailUrl = `/properties/${property.id}${searchParams ? `?${searchParams}` : ""}`;

  return (
    <Card padding="none" className="group relative transition-shadow hover:shadow-md">
      <Link to={detailUrl} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-col items-start gap-1.5">
              <LaneBadge lane={property.lane} />
              <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {property.rating}
              </div>
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[0, 1, 2, 3, 4].map((dot) => (
              <span
                key={dot}
                className={cn(
                  "size-1.5 rounded-full",
                  dot === 0 ? "bg-white" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
                {property.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{property.address}</p>
            </div>
            <div className="shrink-0 text-right">
              <PriceDisplay
                lane={property.lane}
                priceUsd={property.priceUsd}
                priceIdr={property.priceIdr}
                wholesalePricing={property.wholesalePricing}
                mode={mode}
                slotDuration={property.slotDuration}
              />
              {isDirect && property.nextAvailableSlot && (
                <p className="mt-0.5 text-xs text-muted-foreground">{property.nextAvailableSlot}</p>
              )}
              {!isDirect && nights > 1 && (
                <p className="mt-0.5 text-xs text-muted-foreground">{nights} nights total</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {property.distanceFromAirportKm <= 15 && (
              <span className="flex items-center gap-1">
                <Plane className="size-3" />
                {property.distanceFromAirportKm} km from airport
              </span>
            )}
            <span>
              {property.starRating}-star · {property.roomType}
            </span>
          </div>

          <div className="border-t border-border/60 pt-3 text-xs">
            {isDirect ? (
              <span className="flex items-center gap-1 font-medium text-brand">
                <Zap className="size-3.5" />
                Instant confirm
                {mode === "rest" && (
                  <span className="font-normal text-muted-foreground">
                    · {property.slotDuration} slot
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground">
                <ExternalLink className="size-3.5" />
                Complete via {property.supplierName ?? "partner"}
              </span>
            )}
          </div>
        </div>
      </Link>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(property.id);
        }}
        className="absolute right-3 top-3 size-9 rounded-full bg-white/95 shadow-sm hover:bg-white"
      >
        <Heart
          className={cn("size-4", isFavorite ? "fill-red-500 text-red-500" : "text-foreground")}
        />
      </Button>
    </Card>
  );
}
