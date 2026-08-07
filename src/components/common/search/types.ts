import type { BookingMode, RestSlot } from "@/lib/booking/types";
import type { LocationType } from "@/services/zentrumhub";

export interface LocationSuggestion {
  id: string;
  label: string;
  city: string;
  state?: string;
  country: string;
  /** ZentrumHub autosuggest fields (optional) */
  type?: LocationType;
  referenceId?: string | null;
  coordinates?: { lat: number; long: number };
}

export interface SearchFormValues {
  location: LocationSuggestion;
  mode: BookingMode;
  checkIn?: Date;
  checkOut?: Date;
  restDate?: Date;
  slot?: RestSlot;
  guests: string;
  rooms?: number;
  adults?: number;
  children?: number;
}

export type SearchPanelVariant = "hero" | "page" | "landing";
