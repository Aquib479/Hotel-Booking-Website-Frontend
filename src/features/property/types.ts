import type { Property } from "@/features/search/types";
import type { BookingLane } from "@/lib/booking/types";
import type { WholesaleQuote } from "@/lib/currency/format";

export type DetailTab = "details" | "policies" | "reviews" | "messages";

export interface Amenity {
  icon: string;
  label: string;
}

export interface HotelInfo {
  name: string;
  logo?: string;
  phone: string;
  email: string;
  starRating: number;
  supplierName?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
}

export interface PropertyDetail extends Property {
  region: string;
  displayTitle: string;
  reviewCount: number;
  images: string[];
  photoCount: number;
  description: string;
  highlights: string[];
  detailAmenities: Amenity[];
  hotelInfo: HotelInfo;
  policies: string[];
  reviews: Review[];
  mapImage: string;
}

export interface BookingState {
  mode: "rest" | "stay";
  checkIn?: Date;
  checkOut?: Date;
  restDate?: Date;
  slot?: "00-12" | "12-24" | "24h";
  guests: string;
}

export interface PriceBreakdown {
  nights: number;
  subtotal: number;
  tax: number;
  totalDue: number;
  label: string;
}

export interface BookingSidebarProps {
  propertyId: string;
  lane: BookingLane;
  priceUsd: number;
  priceIdr: number;
  mode: "rest" | "stay";
  onModeChange?: (mode: "rest" | "stay") => void;
  hotelTimezone: string;
  wholesalePricing?: WholesaleQuote;
  slotDuration?: "12h" | "24h";
  ringFencedRooms?: number;
  supplierName?: string;
  initialBooking?: Partial<Omit<BookingState, "mode">>;
}
