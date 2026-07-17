import type { BookingLane } from "@/lib/booking/types";
import { LaneBadge } from "@/components/common/LaneBadge";
import { CardImageRow, CardThumbnail } from "@/components/common/CardImageRow";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelSummaryHeaderProps {
  imageUrl: string;
  name: string;
  location: string;
  starRating: number;
  lane: BookingLane;
  className?: string;
  compact?: boolean;
}

export function HotelSummaryHeader({
  imageUrl,
  name,
  location,
  starRating,
  lane,
  className,
  compact = false,
}: HotelSummaryHeaderProps) {
  return (
    <CardImageRow
      className={cn(compact && "p-0 sm:p-0", className)}
      image={
        <CardThumbnail
          src={imageUrl}
          alt={name}
          size={compact ? "md" : "lg"}
          className={compact ? "size-16 sm:size-20" : undefined}
        />
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <LaneBadge lane={lane} />
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{starRating}-star</span>
        </div>
      </div>

      <h2 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">{name}</h2>

      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{location}</p>
    </CardImageRow>
  );
}
