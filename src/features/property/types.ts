import type { Property } from "@/features/search/types";

export type DetailTab = "details" | "policies" | "reviews" | "messages";

export interface Amenity {
  icon: string;
  label: string;
}

export interface Host {
  name: string;
  avatar: string;
  trips: number;
  hostSince: number;
  responseRate: number;
  responseTime: string;
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
  amenities: Amenity[];
  host: Host;
  policies: string[];
  reviews: Review[];
  mapImage: string;
}

export interface BookingState {
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
}

export interface PriceBreakdown {
  nights: number;
  rentalTotal: number;
  discount: number;
  deposit: number;
  totalDue: number;
}
