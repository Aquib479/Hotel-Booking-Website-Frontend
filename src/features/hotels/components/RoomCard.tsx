import type { Room } from "../types";
import { useLanguage } from "@/context/LanguageContext";
import { hasMessage } from "@/lib/i18n/messages";

const FALLBACK_AMENITIES = ["WiFi", "Air conditioning"];

function formatPrice(amount: number, currency: string) {
  if (currency === "IDR") {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  }
  return `${currency} ${amount.toLocaleString()}`;
}

export function RoomCard({ room }: { room: Room }) {
  const { t } = useLanguage();
  const amenities =
    room.amenities.length > 0 ? room.amenities : FALLBACK_AMENITIES;
  const roomTypeKey = room.roomType?.toLowerCase() ?? "";
  const descKey = `hotels.desc.${roomTypeKey}`;
  const description =
    room.description ??
    (hasMessage(descKey) ? t(descKey) : t("hotels.desc.fallback"));
  const coverImage = room.imageUrls[0] ?? null;
  const typeLabel = room.roomType
    ? hasMessage(`search.room.${room.roomType.toLowerCase()}`)
      ? t(`search.room.${room.roomType.toLowerCase()}`)
      : room.roomType
    : t("hotels.standard");

  return (
    <div className="flex gap-4 rounded-lg border p-3">
      {coverImage ? (
        <img
          src={coverImage}
          alt={t("hotels.roomAlt", { type: typeLabel, number: room.roomNumber })}
          className="h-24 w-32 shrink-0 rounded object-cover"
        />
      ) : (
        <div className="flex h-24 w-32 shrink-0 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
          {t("hotels.noImage")}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h4 className="font-medium capitalize">
            {typeLabel}
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
              {hasMessage(`search.amenity.${a}`) ? t(`search.amenity.${a}`) : a}
            </span>
          ))}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
            {room.maxOccupancy === 1
              ? t("hotels.maxGuest", { n: room.maxOccupancy })
              : t("hotels.maxGuests", { n: room.maxOccupancy })}
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
