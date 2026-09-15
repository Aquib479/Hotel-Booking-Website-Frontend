import type { BookingMode, RestSlot } from "@/lib/booking/types";

export interface LocationSuggestion {
  id: string;
  /** Local destination master id — used for bedbank Country/City resolution */
  destinationId?: string;
  label: string;
  city: string;
  state?: string;
  country: string;
}

export interface SearchFormValues {
  location: LocationSuggestion;
  mode: BookingMode;
  checkIn?: Date;
  checkOut?: Date;
  restDate?: Date;
  slot?: RestSlot;
  guests: string;
}

export type SearchPanelVariant = "hero" | "page" | "landing";
