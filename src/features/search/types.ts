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
  /** Guest review score (from content reviews). */
  rating: number;
  /** Guest review count. */
  reviewCount: number;
  /** Official hotel star class (may be fractional). */
  starRating: number;
  lane: BookingLane;
  /**
   * Nightly (or slot) amount in `priceCurrency` when set by the supplier/API.
   * For ZentrumHub wholesale, this is the live amount in the search currency — do not FX-convert for display.
   */
  priceAmount?: number;
  /** ISO currency for `priceAmount` (from ZentrumHub / supplier). */
  priceCurrency?: string;
  /** Full-stay total in `priceCurrency` (ZentrumHub `rate.totalRate`). */
  totalStayAmount?: number;
  /** Published/list rate for the stay when higher than total (strikethrough). */
  publishedStayAmount?: number;
  /** Rate components for the stay total (ZentrumHub `rate.*`). */
  priceBreakdown?: {
    baseRate?: number;
    taxes?: number;
    fees?: number;
    discounts?: number;
    publishedRate?: number;
    totalRate: number;
  };
  /** Legacy/cached USD estimate — used for RestHalf-direct fallbacks and older paths */
  priceUsd: number;
  /** Direct slot rate in IDR (12h base) */
  priceIdr: number;
  /** Supplier quote used to derive wholesale guest price (FX → markup → display) — prefer priceAmount when present */
  wholesalePricing?: WholesaleQuote;
  roomType: RoomType;
  maxOccupancy: number;
  amenities: AmenityFilter[];
  /** Short amenity labels shown as pills on the card. */
  amenityPills: string[];
  freeBreakfast?: boolean;
  freeCancellation?: boolean;
  refundable?: boolean;
  payAtHotel?: boolean;
  boardBasisLabel?: string;
  offerLabel?: string;
  highlightAttributes: string[];
  category: string;
  latitude: number | null;
  longitude: number | null;
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
  rooms?: number;
  adults?: number;
  children?: number;
  /** ZentrumHub destination metadata from URL */
  locationId?: string;
  locationType?: string;
  referenceId?: string;
  lat?: number;
  lng?: number;
  country?: string;
  state?: string;
}

export interface FilterState {
  priceMin: number;
  priceMax: number;
  lane: LaneFilter;
  /** Empty = any. Multi-select OR of exact star counts (2–5). */
  starRatings: number[];
  /** Minimum guest review score; "any" = no filter. */
  guestRatingMin: number | "any";
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
