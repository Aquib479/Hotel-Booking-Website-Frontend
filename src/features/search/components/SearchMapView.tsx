import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { ExternalLink, Heart, MapPin, Star, X, Zap } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import { resolvePropertyCoordinates } from "../map-coordinates";
import type { Property } from "../types";
import "leaflet/dist/leaflet.css";

interface SearchMapViewProps {
  properties: Property[];
  searchParams: string;
  mode: "rest" | "stay";
  nights: number;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

interface MappedProperty extends Property {
  position: { lat: number; lng: number };
  priceLabel: string;
}

const CARD_WIDTH = 255;
const CARD_GAP = 14;
const VIEW_PADDING = 12;

function FitBounds({ positions }: { positions: L.LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [56, 56], maxZoom: 14 });
  }, [map, positions]);

  return null;
}

function MapClickDeselect({ onDeselect }: { onDeselect: () => void }) {
  useMapEvents({
    click: () => onDeselect(),
  });
  return null;
}

/** Reports the selected marker's pixel position inside the map container (no map panning). */
function MarkerPositionBridge({
  position,
  onPointChange,
}: {
  position: { lat: number; lng: number } | null;
  onPointChange: (point: { x: number; y: number } | null) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      onPointChange(null);
      return;
    }

    const update = () => {
      const point = map.latLngToContainerPoint([position.lat, position.lng]);
      onPointChange({ x: point.x, y: point.y });
    };

    update();
    map.on("move", update);
    map.on("zoom", update);
    map.on("zoomend", update);
    map.on("moveend", update);
    map.on("viewreset", update);

    return () => {
      map.off("move", update);
      map.off("zoom", update);
      map.off("zoomend", update);
      map.off("moveend", update);
      map.off("viewreset", update);
    };
  }, [map, onPointChange, position]);

  return null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createPriceIcon(label: string, selected: boolean) {
  const bg = selected ? "#7c3aed" : "#ffffff";
  const color = selected ? "#ffffff" : "#111827";
  const scale = selected ? "scale(1.08)" : "scale(1)";
  const shadow = selected
    ? "0 6px 16px rgba(124, 58, 237, 0.35)"
    : "0 2px 10px rgba(15, 23, 42, 0.18)";

  return L.divIcon({
    className: "rh-price-marker",
    html: `<div style="
      transform:${scale};
      background:${bg};
      color:${color};
      border-radius:999px;
      padding:7px 12px;
      font-size:13px;
      font-weight:700;
      font-family:inherit;
      line-height:1;
      white-space:nowrap;
      box-shadow:${shadow};
      border:1px solid ${selected ? "#7c3aed" : "rgba(15,23,42,0.08)"};
      transition: transform 120ms ease, box-shadow 120ms ease;
    ">${escapeHtml(label)}</div>`,
    iconSize: [80, 32],
    iconAnchor: [40, 16],
  });
}

function MapHotelCard({
  property,
  mode,
  nights,
  isFavorite,
  searchParams,
  onClose,
  onToggleFavorite,
}: {
  property: MappedProperty;
  mode: "rest" | "stay";
  nights: number;
  isFavorite: boolean;
  searchParams: string;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}) {
  const isDirect = property.lane === "direct";
  const detailUrl = `/properties/${property.id}${searchParams ? `?${searchParams}` : ""}`;
  const hasFreeCancellation = property.amenities.includes("Free cancellation");
  const roomLabel = property.roomType.charAt(0).toUpperCase() + property.roomType.slice(1);
  const stayLabel =
    mode === "rest"
      ? `${property.slotDuration} slot`
      : nights > 1
        ? `${nights} nights`
        : "1 night";

  const specs = [
    `${property.starRating}-star`,
    roomLabel,
    `Sleeps ${property.maxOccupancy}`,
    property.distanceFromAirportKm > 0 && property.distanceFromAirportKm <= 15
      ? `${property.distanceFromAirportKm} km to airport`
      : null,
  ].filter(Boolean);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-white text-left shadow-[0_16px_40px_rgba(15,23,42,0.22)]"
      style={{ width: CARD_WIDTH }}
    >
      <div className="absolute right-2.5 top-2.5 z-20 flex items-center gap-1.5">
        <button
          type="button"
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="flex size-8 items-center justify-center rounded-full bg-white/95 text-foreground shadow-[0_2px_8px_rgba(15,23,42,0.12)] backdrop-blur-sm transition hover:scale-105 hover:bg-white"
        >
          <Heart
            className={cn(
              "size-3.5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-foreground/80"
            )}
          />
        </button>
        <button
          type="button"
          aria-label="Close hotel card"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="flex size-8 items-center justify-center rounded-full bg-white/95 text-foreground shadow-[0_2px_8px_rgba(15,23,42,0.12)] backdrop-blur-sm transition hover:scale-105 hover:bg-white"
        >
          <X className="size-3.5 text-foreground/80" />
        </button>
      </div>

      <Link to={detailUrl} className="block overflow-hidden no-underline">
        <div className="relative h-[148px] w-full overflow-hidden">
          <img
            src={property.image}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 m-0 block h-full w-full max-w-none border-0 object-cover object-center p-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

          <div className="absolute left-2.5 top-2.5 origin-top-left scale-90">
            <LaneBadge lane={property.lane} />
          </div>

          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={cn(
                  "h-1 rounded-full transition-all",
                  dot === 0 ? "w-2.5 bg-white" : "w-1 bg-white/55"
                )}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5 bg-white px-3.5 pb-3.5 pt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 min-w-0 flex-1 text-sm font-semibold tracking-tight text-foreground">
              {property.title}
            </h3>
            <span className="flex shrink-0 items-center gap-0.5 pt-0.5 text-xs font-medium text-foreground">
              <Star className="size-3.5 fill-foreground text-foreground" />
              {property.rating.toFixed(1)}
            </span>
          </div>

          <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
            {property.address || [property.city, property.country].filter(Boolean).join(", ")}
          </p>

          <p className="line-clamp-1 text-xs text-muted-foreground">{specs.join(" · ")}</p>

          <div className="flex items-baseline gap-1 pt-0.5">
            <PriceDisplay
              lane={property.lane}
              priceUsd={property.priceUsd}
              priceIdr={property.priceIdr}
              wholesalePricing={property.wholesalePricing}
              mode={mode}
              slotDuration={property.slotDuration}
              showUnit={false}
              amountClassName="text-sm font-semibold tracking-tight"
            />
            <span className="text-xs text-muted-foreground">for {stayLabel}</span>
          </div>

          <div className="flex flex-wrap gap-1 pt-0.5">
            {hasFreeCancellation && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Free cancellation
              </span>
            )}
            {isDirect ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
                <Zap className="size-2.5" />
                Instant confirm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                <ExternalLink className="size-2.5" />
                Via {property.supplierName ?? "partner"}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

function HotelPriceMarker({
  property,
  selected,
  onSelect,
}: {
  property: MappedProperty;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const icon = useMemo(
    () => createPriceIcon(property.priceLabel, selected),
    [property.priceLabel, selected]
  );

  return (
    <Marker
      position={property.position}
      icon={icon}
      zIndexOffset={selected ? 1000 : 0}
      eventHandlers={{
        click: (event) => {
          L.DomEvent.stopPropagation(event.originalEvent);
          onSelect(property.id);
        },
      }}
    />
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function SearchMapView({
  properties,
  searchParams,
  mode,
  nights,
  favorites,
  onToggleFavorite,
}: SearchMapViewProps) {
  const { formatLanePrice } = useCurrency();
  const [selectedId, setSelectedId] = useState<string>("");
  const [markerPoint, setMarkerPoint] = useState<{ x: number; y: number } | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(null);

  const mappedProperties = useMemo<MappedProperty[]>(() => {
    return properties.flatMap((property) => {
      const position = resolvePropertyCoordinates(property);
      if (!position) return [];

      const { amount } = formatLanePrice(
        property.lane,
        property.priceUsd,
        property.priceIdr,
        mode,
        property.wholesalePricing,
        property.slotDuration
      );

      return [
        {
          ...property,
          position,
          priceLabel: amount,
        },
      ];
    });
  }, [properties, mode, formatLanePrice]);

  const positions = useMemo(
    () =>
      mappedProperties.map(
        (property) => [property.position.lat, property.position.lng] as L.LatLngTuple
      ),
    [mappedProperties]
  );

  const selectedProperty = useMemo(
    () => mappedProperties.find((property) => property.id === selectedId) ?? null,
    [mappedProperties, selectedId]
  );

  useEffect(() => {
    if (selectedId && !mappedProperties.some((property) => property.id === selectedId)) {
      setSelectedId("");
    }
  }, [mappedProperties, selectedId]);

  useLayoutEffect(() => {
    if (!selectedProperty || !markerPoint || !shellRef.current) {
      setCardPos(null);
      return;
    }

    const shell = shellRef.current.getBoundingClientRect();
    const cardHeight = cardRef.current?.offsetHeight ?? 320;
    const cardWidth = CARD_WIDTH;

    const spaceAbove = markerPoint.y - VIEW_PADDING;
    const placeAbove = spaceAbove >= cardHeight + CARD_GAP;

    let left = markerPoint.x - cardWidth / 2;
    let top = placeAbove
      ? markerPoint.y - cardHeight - CARD_GAP
      : markerPoint.y + CARD_GAP + 18;

    left = clamp(left, VIEW_PADDING, Math.max(VIEW_PADDING, shell.width - cardWidth - VIEW_PADDING));
    top = clamp(top, VIEW_PADDING, Math.max(VIEW_PADDING, shell.height - cardHeight - VIEW_PADDING));

    setCardPos({ left, top });
  }, [selectedProperty, markerPoint]);

  if (mappedProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-24 text-center">
        <MapPin className="mb-4 size-10 text-muted-foreground/40" />
        <p className="text-lg font-semibold text-foreground">No map data available</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Hotels in your search don&apos;t have location coordinates yet. Switch to Card View to browse
          them.
        </p>
      </div>
    );
  }

  const center = positions[0] ?? ([20, 0] as L.LatLngTuple);

  return (
    <div
      ref={shellRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-white",
        "[&_.leaflet-container]:h-[min(70vh,560px)] [&_.leaflet-container]:w-full [&_.leaflet-container]:bg-[#e8eef5]",
        "[&_.rh-price-marker]:border-0 [&_.rh-price-marker]:bg-transparent"
      )}
    >
      <MapContainer center={center} zoom={12} scrollWheelZoom className="z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        <MapClickDeselect onDeselect={() => setSelectedId("")} />
        <MarkerPositionBridge
          position={selectedProperty?.position ?? null}
          onPointChange={setMarkerPoint}
        />
        {mappedProperties.map((property) => (
          <HotelPriceMarker
            key={property.id}
            property={property}
            selected={selectedId === property.id}
            onSelect={setSelectedId}
          />
        ))}
      </MapContainer>

      {selectedProperty ? (
        <div
          ref={cardRef}
          className="pointer-events-auto absolute z-[1200]"
          style={{
            left: cardPos?.left ?? VIEW_PADDING,
            top: cardPos?.top ?? VIEW_PADDING,
            visibility: cardPos ? "visible" : "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <MapHotelCard
            property={selectedProperty}
            mode={mode}
            nights={nights}
            isFavorite={favorites.has(selectedProperty.id)}
            searchParams={searchParams}
            onClose={() => setSelectedId("")}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ) : null}
    </div>
  );
}
