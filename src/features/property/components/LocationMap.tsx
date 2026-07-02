interface LocationMapProps {
  mapImage: string;
  address: string;
  distanceFromAirportKm: number;
}

export function LocationMap({ mapImage, address, distanceFromAirportKm }: LocationMapProps) {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Where you&apos;ll be</h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        <img src={mapImage} alt={`Map showing ${address}`} className="h-64 w-full object-cover" />
      </div>
      <p className="text-sm text-muted-foreground">{address}</p>
      <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm">
        <span className="text-muted-foreground">Distance from airport: </span>
        <span className="font-semibold text-foreground">{distanceFromAirportKm} km</span>
      </div>
    </section>
  );
}
