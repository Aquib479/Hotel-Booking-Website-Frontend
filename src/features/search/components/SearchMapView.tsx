import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import type { Property } from "../types";

interface SearchMapViewProps {
  properties: Property[];
  searchParams: string;
}

export function SearchMapView({ properties, searchParams }: SearchMapViewProps) {
  const { format: formatCurrency } = useCurrency();

  const geoProperties = useMemo(
    () => properties.filter((p) => p.latitude != null && p.longitude != null),
    [properties]
  );

  const bounds = useMemo(() => {
    if (geoProperties.length === 0) return null;
    const lats = geoProperties.map((p) => p.latitude!);
    const lngs = geoProperties.map((p) => p.longitude!);
    const padding = 0.02;
    return {
      minLat: Math.min(...lats) - padding,
      maxLat: Math.max(...lats) + padding,
      minLng: Math.min(...lngs) - padding,
      maxLng: Math.max(...lngs) + padding,
    };
  }, [geoProperties]);

  if (geoProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-24 text-center">
        <MapPin className="mb-4 size-10 text-muted-foreground/40" />
        <p className="text-lg font-semibold text-foreground">No map data available</p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Hotels in your search don&apos;t have location coordinates yet. Switch to Card View to browse them.
        </p>
      </div>
    );
  }

  const mapSrc = bounds
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}&layer=mapnik${geoProperties.length === 1 ? `&marker=${geoProperties[0].latitude},${geoProperties[0].longitude}` : ""}`
    : "";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe
          title="Hotel locations map"
          src={mapSrc}
          className="h-80 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="space-y-3">
        {geoProperties.map((property) => (
          <Link
            key={property.id}
            to={`/hotel/${property.id}?${searchParams}`}
            className="flex items-center gap-4 rounded-xl border border-border bg-white p-3 transition-shadow hover:shadow-md"
          >
            <img
              src={property.image}
              alt={property.title}
              className="size-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-foreground">{property.title}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {property.address || [property.city, property.country].filter(Boolean).join(", ")}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {property.rating}
                </span>
                {property.priceIdr > 0 && (
                  <span className="text-xs font-medium text-foreground">
                    {formatCurrency(property.priceIdr, "IDR")}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
