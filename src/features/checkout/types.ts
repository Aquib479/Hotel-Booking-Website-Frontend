import type { BookingLane, BookingMode, RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";

export type SupportedCurrency = CurrencyCode;

export interface CheckoutGuests {
  adults: number;
  children: number;
}

export interface CheckoutHotelMeta {
  name: string;
  address: string;
  city: string;
  country: string;
  imageUrl: string;
  starRating: number;
  rating?: number;
  reviewCount?: number;
}

export interface CheckoutDraft {
  propertyId: string;
  roomId?: string;
  bookingId?: string;
  lane: BookingLane;
  mode: BookingMode;
  slotDate?: string;
  slotWindow?: RestSlot;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  guests: CheckoutGuests;
  guestsLabel: string;
  currency: SupportedCurrency;
  holdExpiresAt?: string;
  holdId?: string;
  hotelTimezone: string;
  totalPrice?: number;
  hotelMeta?: CheckoutHotelMeta;
  createdAt: string;
  /** ZentrumHub booking session */
  source?: "resthalf" | "zentrumhub";
  recommendationId?: string;
  rateIds?: string[];
  roomName?: string;
  boardBasis?: string | null;
  refundable?: boolean | null;
  cancellationText?: string | null;
  bedSummary?: string | null;
  maxGuests?: number | null;
  roomTypeLabel?: string | null;
  /** Number of rooms booked (1–9). */
  rooms?: number;
  roomFacilities?: string[];
  roomImageUrl?: string | null;
}

export interface GuestDetailsValues {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  specialRequests: string;
}

export type PaymentMethod = "ewallet" | "virtual_account" | "card";

export type NoDraftReason = "missing" | "expired";

export interface CheckoutFormState {
  values: GuestDetailsValues;
  errors: Partial<Record<keyof GuestDetailsValues, string>>;
  touched: Partial<Record<keyof GuestDetailsValues, boolean>>;
}
