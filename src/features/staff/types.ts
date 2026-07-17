import type { RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";

export type WalkInPaymentMethod = "cash" | "card" | "online";

export interface StaffPropertyScope {
  propertyId: string;
  propertyName: string;
  city: string;
  country: string;
  timezone: string;
  /** Property settlement currency for walk-in transactions */
  localCurrency: CurrencyCode;
  baseSlotRate: number;
}

export interface StaffUser {
  id: string;
  displayName: string;
  email: string;
  property: StaffPropertyScope;
}

export interface WalkInRoom {
  id: string;
  roomNumber: string;
  label: string;
  roomType: string;
  /** Slots still bookable today — from shared availability core */
  availableSlots: RestSlot[];
  rateAmount: number;
  rateCurrency: CurrencyCode;
}

export interface WalkInGuestDetails {
  fullName: string;
  phoneCountryCode: string;
  phoneNational: string;
  email?: string;
  idDocument?: string;
}

export interface WalkInBookingDraft {
  room: WalkInRoom | null;
  slot: RestSlot | null;
  guest: WalkInGuestDetails;
  paymentMethod: WalkInPaymentMethod;
  cashConfirmed?: boolean;
}

export interface WalkInBookingResult {
  success: boolean;
  bookingId: string;
  confirmationCode: string;
  commissionAmount: number;
  commissionCurrency: CurrencyCode;
}

export interface WalkInRecord {
  id: string;
  confirmationCode: string;
  guestName: string;
  roomNumber: string;
  slot: RestSlot;
  slotDate: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: WalkInPaymentMethod;
  commissionAmount: number;
  staffId: string;
  staffName: string;
  propertyId: string;
  createdAt: string;
}

export interface CommissionSummary {
  walkInCount: number;
  totalRevenue: number;
  totalCommission: number;
  currency: CurrencyCode;
  periodLabel: string;
}

export interface AvailableRoomsState {
  rooms: WalkInRoom[];
  isLoading: boolean;
  error: string | null;
  lastRefreshedAt: Date | null;
}
