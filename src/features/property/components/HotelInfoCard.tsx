import { Building2, Mail, Phone } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { CardImageRow } from "@/components/common/CardImageRow";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HotelInfo } from "../types";
import type { BookingLane } from "@/lib/booking/types";

interface HotelInfoCardProps {
  hotel: HotelInfo;
  lane: BookingLane;
}

export function HotelInfoCard({ hotel, lane }: HotelInfoCardProps) {
  return (
    <Card padding="none">
      <CardImageRow
        image={
          hotel.logo ? (
            <img
              src={hotel.logo}
              alt={hotel.name}
              className="aspect-square w-full rounded-xl object-cover ring-1 ring-border/80"
            />
          ) : (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted ring-1 ring-border/80">
              <Building2 className="size-6 text-muted-foreground" />
            </div>
          )
        }
        imageWrapperClassName="sm:w-16"
      >
        <LaneBadge lane={lane} />
        <p className="line-clamp-2 font-semibold leading-snug text-foreground">{hotel.name}</p>
        <p className="text-sm text-muted-foreground">
          {hotel.starRating}-star hotel
          {hotel.supplierName && lane === "wholesale" && ` · via ${hotel.supplierName}`}
        </p>
      </CardImageRow>

      <Separator />

      <div className="space-y-2 p-4 text-sm sm:p-5 sm:pt-4">
        <a
          href={`tel:${hotel.phone}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Phone className="size-4 shrink-0" />
          {hotel.phone}
        </a>
        <a
          href={`mailto:${hotel.email}`}
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="size-4 shrink-0" />
          {hotel.email}
        </a>
      </div>
    </Card>
  );
}
