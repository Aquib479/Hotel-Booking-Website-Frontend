import type { Host } from "../types";

interface LocationMapProps {
  mapImage: string;
  address: string;
  host: Host;
}

export function LocationMap({ mapImage, address, host }: LocationMapProps) {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Where you'll be</h2>
      <div className="overflow-hidden rounded-2xl border border-border">
        <img src={mapImage} alt={`Map showing ${address}`} className="h-64 w-full object-cover" />
      </div>
      <p className="text-sm text-muted-foreground">{address}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <span className="text-muted-foreground">Response rate: </span>
          <span className="font-semibold text-foreground">{host.responseRate}%</span>
        </div>
        <div className="rounded-xl border border-border bg-white px-4 py-3 text-sm">
          <span className="text-muted-foreground">Response time: </span>
          <span className="font-semibold text-foreground">{host.responseTime}</span>
        </div>
      </div>
    </section>
  );
}
