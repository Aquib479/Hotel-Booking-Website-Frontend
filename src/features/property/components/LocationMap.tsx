interface LocationMapProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

export function LocationMap({ latitude, longitude, address }: LocationMapProps) {
  if (latitude == null || longitude == null) return null;

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Where you&apos;ll be</h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe
          title={`Map showing ${address}`}
          src={src}
          className="h-64 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{address}</p>
        <a
          href={osmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View larger map
        </a>
      </div>
    </section>
  );
}
