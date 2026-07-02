import { Link } from "react-router-dom";
import { ExternalLink, Heart, Plane, Star, Zap } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
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
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={detailUrl} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            <LaneBadge lane={property.lane} />
            <div className="flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold shadow-sm">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {property.rating}
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

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-foreground">{property.title}</h3>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{property.address}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {property.distanceFromAirportKm <= 15 && (
                  <span className="flex items-center gap-1">
                    <Plane className="size-3" />
                    {property.distanceFromAirportKm} km from airport
                  </span>
                )}
                <span>{property.starRating}-star · {property.roomType}</span>
              </div>
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
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {nights} nights total
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            {isDirect ? (
              <span className="flex items-center gap-1 font-medium text-brand">
                <Zap className="size-3.5" />
                Instant confirm
                {mode === "rest" && (
                  <span className="font-normal text-muted-foreground">· {property.slotDuration} slot</span>
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

      <button
        type="button"
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite(property.id);
        }}
        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition-colors hover:bg-white"
      >
        <Heart
          className={cn("size-4", isFavorite ? "fill-red-500 text-red-500" : "text-foreground")}
        />
      </button>
    </article>
  );
}
