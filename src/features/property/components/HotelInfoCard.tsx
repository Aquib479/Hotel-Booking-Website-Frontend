import { Building2, Mail, Phone } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import type { HotelInfo } from "../types";
import type { BookingLane } from "@/lib/booking/types";

interface HotelInfoCardProps {
  hotel: HotelInfo;
  lane: BookingLane;
}

export function HotelInfoCard({ hotel, lane }: HotelInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {hotel.logo ? (
          <img
            src={hotel.logo}
            alt={hotel.name}
            className="size-12 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <Building2 className="size-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">{hotel.name}</p>
          <p className="text-sm text-muted-foreground">
            {hotel.starRating}-star hotel
            {hotel.supplierName && lane === "wholesale" && ` · via ${hotel.supplierName}`}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <LaneBadge lane={lane} />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <a
          href={`tel:${hotel.phone}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Phone className="size-4" />
          {hotel.phone}
        </a>
        <a
          href={`mailto:${hotel.email}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="size-4" />
          {hotel.email}
        </a>
      </div>
    </div>
  );
}
