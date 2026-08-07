import type { LocationSuggestion, SearchFormValues } from "./types";
import type { LocationType } from "@/services/zentrumhub";
import {
  autosuggest,
  isZentrumConfigured,
  type LocationSuggestionZh,
} from "@/services/zentrumhub";

export const GUEST_OPTIONS = [
  "1 adult",
  "2 adults",
  "2 adults, 1 kid",
  "2 adults, 2 kids",
  "3+ adults",
] as const;

/** Hydrate a location from a URL city string (not used as a suggestion source). */
export function toLocationSuggestion(city: string): LocationSuggestion {
  const trimmed = city.trim();
  return {
    id: trimmed,
    city: trimmed,
    country: "",
    label: trimmed,
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

/** Location suggestions come only from ZentrumHub autosuggest. */
export async function searchLocations(query: string): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  if (!isZentrumConfigured()) {
    throw new Error("ZentrumHub credentials are required for location search");
  }

  const { data } = await autosuggest(trimmed, { size: 10 });
  return (data.locationSuggestions ?? [])
    .map(mapZentrumSuggestion)
    .filter((item): item is LocationSuggestion => item !== null)
    .slice(0, 10);
}
