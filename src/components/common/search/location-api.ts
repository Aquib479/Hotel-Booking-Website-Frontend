import type { LocationSuggestion, SearchFormValues } from "./types";

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  region?: string;
  country?: string;
}

interface NominatimResult {
  place_id: number;
  name?: string;
  display_name: string;
  address?: NominatimAddress;
}

const FALLBACK_LOCATIONS: LocationSuggestion[] = [
  { id: "fb-bangalore", city: "Bangalore", state: "Karnataka", country: "India", label: "Bangalore, Karnataka, India" },
  { id: "fb-mumbai", city: "Mumbai", state: "Maharashtra", country: "India", label: "Mumbai, Maharashtra, India" },
  { id: "fb-delhi", city: "New Delhi", state: "Delhi", country: "India", label: "New Delhi, Delhi, India" },
  { id: "fb-toronto", city: "Toronto", state: "Ontario", country: "Canada", label: "Toronto, Ontario, Canada" },
  { id: "fb-london", city: "London", state: "England", country: "United Kingdom", label: "London, England, United Kingdom" },
  { id: "fb-paris", city: "Paris", state: "Île-de-France", country: "France", label: "Paris, Île-de-France, France" },
  { id: "fb-tokyo", city: "Tokyo", state: "Tokyo", country: "Japan", label: "Tokyo, Tokyo, Japan" },
  { id: "fb-new-york", city: "New York", state: "New York", country: "United States", label: "New York, New York, United States" },
  { id: "fb-dubai", city: "Dubai", state: "Dubai", country: "United Arab Emirates", label: "Dubai, Dubai, United Arab Emirates" },
  { id: "fb-sydney", city: "Sydney", state: "New South Wales", country: "Australia", label: "Sydney, New South Wales, Australia" },
  { id: "fb-zurich", city: "Zurich", state: "Zurich", country: "Switzerland", label: "Zurich, Zurich, Switzerland" },
  { id: "fb-maldives", city: "Malé", state: "Kaafu Atoll", country: "Maldives", label: "Malé, Kaafu Atoll, Maldives" },
];

export const GUEST_OPTIONS = [
  "1 adult",
  "2 adults",
  "2 adults, 1 kid",
  "2 adults, 2 kids",
  "3+ adults",
] as const;

export const DEFAULT_LOCATION: LocationSuggestion = FALLBACK_LOCATIONS[0];

export function toLocationSuggestion(city: string): LocationSuggestion {
  const match = FALLBACK_LOCATIONS.find(
    (loc) =>
      loc.city.toLowerCase() === city.toLowerCase() ||
      loc.label.toLowerCase().includes(city.toLowerCase())
  );

  if (match) return match;

  return {
    id: `query-${city}`,
    city,
    country: "",
    label: city,
  };
}

export function buildSearchParams(values: SearchFormValues): URLSearchParams {
  return new URLSearchParams({
    location: values.location.city,
    guests: values.guests,
    ...(values.checkIn && { checkIn: values.checkIn.toISOString() }),
    ...(values.checkOut && { checkOut: values.checkOut.toISOString() }),
  });
}

function formatSuggestion(result: NominatimResult): LocationSuggestion | null {
  const address = result.address;
  if (!address?.country) return null;

  const city =
    address.city ??
    address.town ??
    address.village ??
    result.name ??
    result.display_name.split(",")[0]?.trim();

  if (!city) return null;

  const state = address.state ?? address.region;
  const country = address.country;
  const label = [city, state, country].filter(Boolean).join(", ");

  return { id: String(result.place_id), city, state, country, label };
}

function filterFallback(query: string): LocationSuggestion[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return FALLBACK_LOCATIONS.filter(
    (loc) =>
      loc.city.toLowerCase().includes(q) ||
      loc.state?.toLowerCase().includes(q) ||
      loc.country.toLowerCase().includes(q) ||
      loc.label.toLowerCase().includes(q)
  );
}

export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const fallback = filterFallback(trimmed);

  try {
    const params = new URLSearchParams({
      q: trimmed,
      format: "json",
      addressdetails: "1",
      limit: "8",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      { headers: { "Accept-Language": "en" } }
    );

    if (!response.ok) return fallback;

    const data = (await response.json()) as NominatimResult[];
    const remote = data
      .map(formatSuggestion)
      .filter((item): item is LocationSuggestion => item !== null);

    const seen = new Set<string>();
    const merged: LocationSuggestion[] = [];

    for (const item of [...fallback, ...remote]) {
      const key = item.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }

    return merged.slice(0, 8);
  } catch {
    return fallback;
  }
}
