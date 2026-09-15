import type { LocationSuggestion, SearchFormValues } from "./types";
import { api } from "@/services/api";

type DestinationAutocompleteItem = {
  id: string;
  cityName: string;
  countryName: string;
  label: string;
};

/** Sensible default until user picks from autocomplete (no destinationId yet). */
export const DEFAULT_LOCATION: LocationSuggestion = {
  id: "default-jakarta",
  city: "Jakarta",
  country: "Indonesia",
  label: "Jakarta, Indonesia",
};

export const GUEST_OPTIONS = [
  "1 adult",
  "2 adults",
  "2 adults, 1 kid",
  "2 adults, 2 kids",
  "3+ adults",
] as const;

export function toLocationSuggestion(
  city: string,
  destinationId?: string | null,
  country?: string | null,
): LocationSuggestion {
  const trimmed = city.trim();
  if (!trimmed && !destinationId) return DEFAULT_LOCATION;

  return {
    id: destinationId || `query-${trimmed}`,
    destinationId: destinationId || undefined,
    city: trimmed || DEFAULT_LOCATION.city,
    country: country?.trim() || "",
    label: country?.trim()
      ? `${trimmed}, ${country.trim()}`
      : trimmed || DEFAULT_LOCATION.label,
  };
}

export function buildSearchParams(values: SearchFormValues): URLSearchParams {
  const params: Record<string, string> = {
    location: values.location.city,
    guests: values.guests,
    mode: values.mode,
  };

  if (values.location.destinationId) {
    params.destinationId = values.location.destinationId;
  }
  if (values.location.country) {
    params.country = values.location.country;
  }

  if (values.mode === "stay") {
    if (values.checkIn) params.checkIn = values.checkIn.toISOString();
    if (values.checkOut) params.checkOut = values.checkOut.toISOString();
  } else {
    if (values.restDate) params.restDate = values.restDate.toISOString();
    if (values.slot) params.slot = values.slot;
  }

  return new URLSearchParams(params);
}

function mapAutocompleteItem(
  item: DestinationAutocompleteItem,
): LocationSuggestion {
  return {
    id: item.id,
    destinationId: item.id,
    city: item.cityName,
    country: item.countryName,
    label: item.label,
  };
}

/** Debounced callers should use React Query; this is the fetch function. */
export async function searchLocations(
  query: string,
): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const params = new URLSearchParams({
      q: trimmed,
      limit: "20",
    });
    const results = await api.get<DestinationAutocompleteItem[]>(
      `/destinations/autocomplete?${params.toString()}`,
    );
    return results.map(mapAutocompleteItem);
  } catch {
    return [];
  }
}
