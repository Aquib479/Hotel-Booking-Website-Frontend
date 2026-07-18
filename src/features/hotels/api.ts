import { api, ApiError } from "@/services/api";
import type { Hotel, Room, HotelSearchParams } from "./types";

type HotelApiResponse = {
  id: string;
  name: string;
  address?: string | null;
  city: string | null;
  country?: string | null;
  rating?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  source?: string;
  externalId?: string | null;
  isActive: boolean;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  createdAt: string;
};

type RoomApiResponse = {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType?: string | null;
  description?: string | null;
  maxOccupancy?: number;
  amenities?: string[] | null;
  imageUrls?: string[] | null;
  price12h: number;
  price24h: number;
  currency?: string;
  createdAt: string;
};

function toHotel(data: HotelApiResponse): Hotel {
  return {
    id: data.id,
    name: data.name,
    address: data.address ?? null,
    city: data.city ?? null,
    country: data.country ?? null,
    rating: data.rating ?? null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    source: data.source ?? "direct",
    externalId: data.externalId ?? null,
    isActive: data.isActive,
    imageUrl: data.imageUrl ?? null,
    imageUrls: data.imageUrls ?? [],
    createdAt: data.createdAt,
  };
}

function toRoom(data: RoomApiResponse): Room {
  return {
    id: data.id,
    hotelId: data.hotelId,
    roomNumber: data.roomNumber,
    roomType: data.roomType ?? null,
    description: data.description ?? null,
    maxOccupancy: data.maxOccupancy ?? 2,
    amenities: data.amenities ?? [],
    imageUrls: data.imageUrls ?? [],
    price12h: +data.price12h,
    price24h: +data.price24h,
    currency: data.currency ?? "IDR",
    createdAt: data.createdAt,
  };
}

export async function getHotels(params?: HotelSearchParams): Promise<Hotel[]> {
  const searchParams = new URLSearchParams();
  if (params?.query?.trim()) searchParams.set("q", params.query.trim());
  if (params?.city?.trim()) searchParams.set("city", params.city.trim());
  const qs = searchParams.toString();
  const path = qs ? `/hotels?${qs}` : "/hotels";
  const hotels = await api.get<HotelApiResponse[]>(path);
  return hotels.map(toHotel);
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  try {
    const hotel = await api.get<HotelApiResponse>(`/hotels/${id}`);
    return toHotel(hotel);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

export async function getRoomsByHotel(hotelId: string): Promise<Room[]> {
  const rooms = await api.get<RoomApiResponse[]>(`/hotels/${hotelId}/rooms`);
  return rooms.map(toRoom);
}
