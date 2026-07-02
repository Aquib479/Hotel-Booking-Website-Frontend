import type {
  AmenityFilter,
  BookingLane,
  BookingMode,
  RestSlot,
  RoomType,
  SlotDuration,
} from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";

export type SortOption =
  | "latest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "soonest-slot";

export type ViewMode = "card" | "map";
export type CountFilter = number | "any";
export type LaneFilter = BookingLane | "all";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
  image: string;
  rating: number;
  starRating: number;
  lane: BookingLane;
  /** Cached guest USD rate; wholesale values are derived from supplier quote + markup */
  priceUsd: number;
  /** Direct slot rate in IDR (12h base) */
  priceIdr: number;
  /** Supplier quote used to derive wholesale guest price (FX → markup → display) */
  wholesalePricing?: WholesaleQuote;
  roomType: RoomType;
  maxOccupancy: number;
  amenities: AmenityFilter[];
  category: string;
  distanceFromAirportKm: number;
  slotDuration: SlotDuration;
  /** IANA timezone for slot cutoffs and checkout hold countdowns */
  timezone: string;
  supplierName?: string;
  nextAvailableSlot?: string;
  ringFencedRooms?: number;
  createdAt: string;
}

export interface SearchQuery {
  location: string;
  mode: BookingMode;
  checkIn?: Date;
  checkOut?: Date;
  restDate?: Date;
  slot?: RestSlot;
  guests: string;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  lane: LaneFilter;
  starRating: CountFilter;
  roomType: RoomType | "any";
  maxOccupancy: CountFilter;
  amenities: AmenityFilter[];
  slotDuration: SlotDuration | "any";
  maxAirportDistance: number | "any";
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
