import { zh } from "./client";
import { zentrumConfig } from "./config";
import type { AutosuggestResponse, LocationDetails } from "./types";

export async function autosuggest(
  term: string,
  options?: { size?: number; correlationId?: string }
) {
  const params = new URLSearchParams({
    term: term.trim(),
    culture: zentrumConfig.culture,
    size: String(options?.size ?? 10),
  });

  return zh.get<AutosuggestResponse>(
    `/api/locations/LocationContent/autosuggest?${params}`,
    { base: "autosuggest", correlationId: options?.correlationId }
  );
}

export async function getLocationDetails(
  locationId: string,
  options?: { correlationId?: string }
) {
  const params = new URLSearchParams({
    culture: zentrumConfig.culture,
  });

  return zh.get<LocationDetails>(
    `/api/locations/LocationContent/location/${encodeURIComponent(locationId)}?${params}`,
    { base: "autosuggest", correlationId: options?.correlationId }
  );
}
