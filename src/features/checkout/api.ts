import { api } from "@/services/api";
import { AUTH_TOKEN_KEY } from "@/features/auth/constants";

function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export interface HoldResponse {
  bookingId: string;
  status: string;
  holdExpiresAt: string;
  checkIn: string;
  checkOut: string;
  slotType: string;
  numGuests: number;
  totalPrice: number;
  currency: string;
  room: { id: string; roomNumber: string; roomType: string };
  hotel: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    country: string | null;
    rating: number | null;
    imageUrl: string | null;
    imageUrls: string[];
  };
}

export interface ConfirmResponse {
  bookingId: string;
  paymentOrderId: string;
  paymentExpiresAt: string;
  snapToken: string;
  redirectUrl: string;
}

export interface SearchAvailabilityRoom {
  id: string;
  roomNumber: string;
  roomType: string;
  description: string | null;
  maxOccupancy: number;
  amenities: string[];
  imageUrls: string[];
  price: number;
  currency: string;
}

export interface SearchAvailabilityResponse {
  hotel: {
    id: string;
    name: string;
    address: string | null;
    city: string | null;
    country: string | null;
    rating: number | null;
    imageUrl: string | null;
  };
  date: string;
  slotType: string;
  startTime: string;
  endTime: string;
  rooms: SearchAvailabilityRoom[];
}

export async function searchAvailability(
  hotelId: string,
  date: string,
  slotType: "HALF_DAY" | "FULL_DAY"
): Promise<SearchAvailabilityResponse> {
  const params = new URLSearchParams({ hotelId, date, slotType });
  return api.get<SearchAvailabilityResponse>(`/search/availability?${params}`);
}

export async function createHold(params: {
  roomId: string;
  date: string;
  slotType: "HALF_DAY" | "FULL_DAY";
  numGuests: number;
}): Promise<HoldResponse> {
  const token = getToken();
  return api.post<HoldResponse>("/bookings/hold", params, { token });
}

export async function confirmBooking(bookingId: string): Promise<ConfirmResponse> {
  const token = getToken();
  return api.post<ConfirmResponse>(`/bookings/${bookingId}/confirm`, undefined, { token });
}

export async function releaseBooking(bookingId: string): Promise<{ released: boolean }> {
  const token = getToken();
  return api.post<{ released: boolean }>(`/bookings/${bookingId}/release`, undefined, { token });
}
