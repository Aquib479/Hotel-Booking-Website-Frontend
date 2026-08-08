import { useState } from "react";
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
  onShowMore,
}: PropertyHighlightsProps) {
  const [expanded, setExpanded] = useState(false);

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

  const visible = expanded ? unique.slice(0, 8) : unique.slice(0, 4);
  const remaining = Math.max(0, unique.length - visible.length);

  return <></>;
}
