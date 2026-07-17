import { getSlotWindowLabel } from "@/features/checkout/constants";
import { formatPrice } from "@/lib/currency/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { WalkInRoom } from "../types";

interface RoomAvailabilityCardProps {
  room: WalkInRoom;
  selected: boolean;
  onSelect: () => void;
}

export function RoomAvailabilityCard({ room, selected, onSelect }: RoomAvailabilityCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-pointer transition-all hover:shadow-sm",
        selected && "border-brand ring-2 ring-brand/30"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{room.label}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {room.roomType} · Direct inventory
            </p>
          </div>
          <p className="text-sm font-bold">{formatPrice(room.rateAmount, room.rateCurrency)}</p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.availableSlots.map((slot) => (
            <Badge key={slot} variant="secondary">
              {getSlotWindowLabel(slot)}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
