import type { Room } from "../types";

const FALLBACK_AMENITIES = ["WiFi", "AC"];

const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  single: "Cozy single room with essential amenities for a comfortable rest.",
  double: "Spacious double room ideal for couples or solo travellers wanting extra space.",
  suite: "Premium suite with separate living area and luxury finishes.",
  family: "Generously sized family room accommodating up to 4 guests.",
};

function formatPrice(amount: number, currency: string) {
  if (currency === "IDR") {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function RoomCard({ room }: { room: Room }) {
  const amenities =
    room.amenities.length > 0 ? room.amenities : FALLBACK_AMENITIES;
  const description =
    room.description ??
    FALLBACK_DESCRIPTIONS[room.roomType?.toLowerCase() ?? ""] ??
    "Comfortable room with modern amenities.";
  const coverImage = room.imageUrls[0] ?? null;

  return (
    <div className="flex gap-4 rounded-lg border p-3">
      {coverImage ? (
        <img
          src={coverImage}
          alt={`${room.roomType ?? "Room"} ${room.roomNumber}`}
          className="h-24 w-32 shrink-0 rounded object-cover"
        />
      ) : (
        <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          No image
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="font-medium capitalize">
            {room.roomType ?? "Standard"}
          </h4>
          <span className="text-xs text-muted-foreground">
            #{room.roomNumber}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {amenities.map((a) => (
            <span
              key={a}
              className="rounded-full bg-secondary px-2 py-0.5 text-xs"
            >
              {a}
            </span>
          ))}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
            Max {room.maxOccupancy} guest{room.maxOccupancy !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-1.5 flex gap-3 text-sm font-medium">
          <span>{formatPrice(room.price12h, room.currency)} / 12h</span>
          <span className="text-muted-foreground">
            {formatPrice(room.price24h, room.currency)} / 24h
          </span>
        </div>
      </div>
    </div>
  );
}
