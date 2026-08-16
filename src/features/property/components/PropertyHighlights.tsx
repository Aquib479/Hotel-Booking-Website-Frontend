import {
  Bath,
  Coffee,
  ConciergeBell,
  Dumbbell,
  MapPin,
  ParkingSquare,
  Sparkles,
  Utensils,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";

const HIGHLIGHT_ICONS: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /wifi|wi-?fi|internet/i, icon: Wifi },
  { match: /pool|swim|beach/i, icon: Waves },
  { match: /breakfast|dining|restaurant|food|varied/i, icon: Utensils },
  { match: /coffee|cafe|lounge/i, icon: Coffee },
  { match: /park|parking/i, icon: ParkingSquare },
  { match: /gym|fitness|workout/i, icon: Dumbbell },
  { match: /ac|air.?cond|cooling/i, icon: Wind },
  { match: /bath|spa|shower/i, icon: Bath },
  { match: /location|ideal|central/i, icon: MapPin },
  { match: /24|concierge|room.?service|front.?desk/i, icon: ConciergeBell },
];

export function iconForAmenityLabel(label: string): LucideIcon {
  for (const entry of HIGHLIGHT_ICONS) {
    if (entry.match.test(label)) return entry.icon;
  }
  return Sparkles;
}

interface PropertyHighlightsProps {
  items: string[];
  amenities?: Array<{ label: string }>;
  onShowMore?: () => void;
}

/** Circular icon strip — Trip.com-style scanability. */
export function PropertyHighlights({
  items,
  amenities = [],
}: PropertyHighlightsProps) {
  const labels = [...items, ...amenities.map((a) => a.label)]
    .map((l) => l.trim())
    .filter(Boolean);

  const unique: string[] = [];
  for (const label of labels) {
    const key = label.toLowerCase();
    if (unique.some((u) => u.toLowerCase() === key)) continue;
    unique.push(label);
  }

  if (!unique.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {unique.slice(0, 8).map((label) => {
        const Icon = iconForAmenityLabel(label);
        return (
          <div
            key={label}
            className="flex min-w-0 items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-sm text-muted-foreground"
          >
            <Icon className="size-3.5 shrink-0 text-brand" />
            <span className="truncate">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
