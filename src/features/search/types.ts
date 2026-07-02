export type PlaceType = "entire" | "shared" | "room";
export type PropertyType = "house" | "apartment" | "cabin" | "villa" | "camping";
export type SortOption = "latest" | "price-asc" | "price-desc" | "rating";
export type ViewMode = "card" | "map";
export type CountFilter = number | "any";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  pricePerNight: number;
  category: string;
  placeType: PlaceType;
  propertyType: PropertyType;
  createdAt: string;
}

export interface SearchQuery {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  placeTypes: PlaceType[];
  bedrooms: CountFilter;
  beds: CountFilter;
  bathrooms: CountFilter;
  propertyType: PropertyType | "any";
  category: string;
}

export interface SearchState {
  query: SearchQuery;
  filters: FilterState;
  sort: SortOption;
  view: ViewMode;
  page: number;
  perPage: number;
  favorites: Set<string>;
}
