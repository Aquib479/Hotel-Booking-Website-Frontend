export interface LocationSuggestion {
  id: string;
  label: string;
  city: string;
  state?: string;
  country: string;
}

export interface SearchFormValues {
  location: LocationSuggestion;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

export type SearchPanelVariant = "hero" | "page";
