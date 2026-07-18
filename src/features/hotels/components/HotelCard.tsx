import type { Hotel } from "../types";
import { useHotelRooms } from "../hooks/useHotelRooms";
import { RoomCard } from "./RoomCard";
import { useState } from "react";
import { Star } from "lucide-react";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const [expanded, setExpanded] = useState(false);
  const { data: rooms, isLoading } = useHotelRooms(
    expanded ? hotel.id : undefined
  );

  const location = [hotel.address, hotel.city, hotel.country]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="overflow-hidden rounded-lg border">
      {hotel.imageUrl ? (
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="aspect-[16/10] w-full object-cover"
        />
      ) : null}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-medium">{hotel.name}</h3>
            {location ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{location}</p>
            ) : null}
          </div>
          {hotel.rating != null ? (
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {hotel.rating}
            </div>
          ) : null}
        </div>

        {hotel.source !== "direct" ? (
          <span className="mt-1.5 inline-block rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            via {hotel.source.toUpperCase()}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 block text-sm font-medium text-primary hover:underline"
        >
          {expanded ? "Hide rooms" : "View rooms"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No rooms available.
              </p>
            ) : (
              rooms.map((room) => <RoomCard key={room.id} room={room} />)
            )}
          </div>
        )}
      </div>
    </article>
  );
}
