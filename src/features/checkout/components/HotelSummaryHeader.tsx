import type { BookingLane } from "@/lib/booking/types";
import { LaneBadge } from "@/components/common/LaneBadge";
import { Star } from "lucide-react";

interface HotelSummaryHeaderProps {
  imageUrl: string;
  name: string;
  location: string;
  starRating: number;
  lane: BookingLane;
}

export function HotelSummaryHeader({
  imageUrl,
  name,
  location,
  starRating,
  lane,
}: HotelSummaryHeaderProps) {
  return (
    <div className="flex gap-3">
      <img
        src={imageUrl}
        alt=""
        className="size-16 shrink-0 rounded-xl object-cover sm:size-20"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-foreground">{name}</h2>
          <LaneBadge lane={lane} />
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{location}</p>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>{starRating}-star hotel</span>
        </div>
      </div>
    </div>
  );
}
