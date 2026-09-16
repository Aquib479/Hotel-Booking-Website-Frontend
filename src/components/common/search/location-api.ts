import type { LocationSuggestion, SearchFormValues } from "./types";
import type { LocationType } from "@/services/zentrumhub";
import { api } from "@/services/api";
import {
  autosuggest,
  isZentrumConfigured,
  type LocationSuggestionZh,
} from "@/services/zentrumhub";

type DestinationAutocompleteItem = {
  id: string;
  cityName: string;
  countryName: string;
  label: string;
};

export const GUEST_OPTIONS = [
  "1 adult",
  "2 adults",
  "2 adults, 1 kid",
  "2 adults, 2 kids",
  "3+ adults",
] as const;

/** Hydrate a location from a URL city string (not used as a suggestion source). */
export function toLocationSuggestion(
  city: string,
  destinationId?: string | null,
  country?: string | null,
): LocationSuggestion {
  const trimmed = city.trim();
  return {
    id: destinationId || trimmed,
    destinationId: destinationId || undefined,
    city: trimmed,
    country: country?.trim() || "",
    label: country?.trim() ? `${trimmed}, ${country.trim()}` : trimmed,
  };
}

export function buildSearchParams(values: SearchFormValues): URLSearchParams {
  const params: Record<string, string> = {
    mode: values.mode,
  };

  const locationLabel = values.location.city || values.location.label;
  if (locationLabel) params.location = locationLabel;
  if (values.guests) params.guests = values.guests;
  if (values.rooms != null && values.rooms > 0) params.rooms = String(values.rooms);
  if (values.adults != null && values.adults > 0) params.adults = String(values.adults);
  if (values.children != null && values.children >= 0) {
    params.children = String(values.children);
  }

  if (values.location.destinationId) {
    params.destinationId = values.location.destinationId;
  }
  if (values.location.id) params.locationId = values.location.id;
  if (values.location.type) params.locationType = values.location.type;
  if (values.location.referenceId) params.referenceId = values.location.referenceId;
  if (values.location.coordinates) {
    params.lat = String(values.location.coordinates.lat);
    params.lng = String(values.location.coordinates.long);
  }
  if (values.location.country) params.country = values.location.country;
  if (values.location.state) params.state = values.location.state;

  if (values.mode === "stay") {
    if (values.checkIn) params.checkIn = values.checkIn.toISOString();
    if (values.checkOut) params.checkOut = values.checkOut.toISOString();
  } else {
    if (values.restDate) params.restDate = values.restDate.toISOString();
    if (values.slot) params.slot = values.slot;
  }

  return new URLSearchParams(params);
}

function mapZentrumSuggestion(item: LocationSuggestionZh): LocationSuggestion | null {
  const label = item.fullName || item.name;
  if (!label) return null;

  return {
    id: item.id || item.referenceId || label,
    label,
    city: item.city || item.name || label,
    state: item.state ?? undefined,
    country: item.country || "",
    type: item.type as LocationType | undefined,
    referenceId: item.referenceId,
    coordinates: item.coordinates,
  };
}

function mapDestinationItem(item: DestinationAutocompleteItem): LocationSuggestion {
  return {
    id: item.id,
    destinationId: item.id,
    city: item.cityName,
    country: item.countryName,
    label: item.label,
  };
}

async function searchDestinations(query: string): Promise<LocationSuggestion[]> {
  try {
    const params = new URLSearchParams({ q: query, limit: "10" });
    const results = await api.get<DestinationAutocompleteItem[]>(
      `/destinations/autocomplete?${params.toString()}`,
    );
    return results.map(mapDestinationItem);
  } catch {
    return [];
  }
}

/**
 * Location suggestions: ZentrumHub autosuggest (UI) + destination master
 * (destinationId for MG bedbank). Destination hits are listed first.
 */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const destinationsPromise = searchDestinations(trimmed);

  let zh: LocationSuggestion[] = [];
  if (trimmed.length >= 3 && isZentrumConfigured()) {
    try {
      const { data } = await autosuggest(trimmed, { size: 10 });
      zh = (data.locationSuggestions ?? [])
        .map(mapZentrumSuggestion)
        .filter((item): item is LocationSuggestion => item !== null);
    } catch {
      /* destinations alone still usable */
    }
  } else if (trimmed.length >= 3 && !isZentrumConfigured()) {
    // Keep develop behavior when ZH is required for full search UX,
    // but still allow destination-only results below.
  }

  const destinations = await destinationsPromise;

  // Attach destinationId onto ZH rows when city/country match a master row.
  const enrichedZh = zh.map((item) => {
    if (item.destinationId) return item;
    const match = destinations.find(
      (d) =>
        d.city.toLowerCase() === item.city.toLowerCase() ||
        d.label.toLowerCase() === item.label.toLowerCase(),
    );
    return match ? { ...item, destinationId: match.destinationId } : item;
  });

  const seen = new Set<string>();
  const merged: LocationSuggestion[] = [];
  for (const item of [...destinations, ...enrichedZh]) {
    const key = item.destinationId || item.id || item.label;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  if (merged.length === 0 && trimmed.length >= 3 && !isZentrumConfigured()) {
    throw new Error("ZentrumHub credentials are required for location search");
  }

  return merged.slice(0, 12);
}
