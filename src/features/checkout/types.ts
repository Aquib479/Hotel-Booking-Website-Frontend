import type { BookingLane, BookingMode, RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";

export type SupportedCurrency = CurrencyCode;

export interface CheckoutGuests {
  adults: number;
  children: number;
}

export interface CheckoutDraft {
  propertyId: string;
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
  createdAt: string;
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
