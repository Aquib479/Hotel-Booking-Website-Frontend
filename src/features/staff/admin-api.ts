import { api, API_BASE_URL } from "@/services/api";

export interface AdminHotel {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  source: string;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: string;
  roomCount: number;
  minPrice12h: number | null;
  minPrice24h: number | null;
  currency: string;
  maxOccupancy: number | null;
  roomTypes: string[];
}

export interface AdminRoom {
  id: string;
  hotelId: string;
  roomNumber: string;
  roomType: string | null;
  description: string | null;
  maxOccupancy: number;
  amenities: string[];
  imageUrls: string[];
  price12h: number;
  price24h: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateHotelPayload {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  source?: string;
}

export interface CreateRoomPayload {
  hotelId: string;
  roomNumber: string;
  roomType?: string;
  description?: string;
  maxOccupancy?: number;
  amenities?: string[];
  price12h: number;
  price24h: number;
}

export async function fetchAdminHotels(): Promise<AdminHotel[]> {
  return api.get<AdminHotel[]>("/admin/hotels");
}

export async function createHotel(data: CreateHotelPayload): Promise<AdminHotel> {
  return api.post<AdminHotel>("/admin/hotels", data);
}

export async function uploadHotelImage(
  hotelId: string,
  file: File,
  cover = false
): Promise<AdminHotel> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/admin/hotels/${hotelId}/images${cover ? "?cover=true" : ""}`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      (body as { message?: string })?.message ?? `Upload failed (${res.status})`
    );
  }
  return res.json() as Promise<AdminHotel>;
}

export async function fetchAdminRooms(hotelId?: string): Promise<AdminRoom[]> {
  const qs = hotelId ? `?hotelId=${hotelId}` : "";
  return api.get<AdminRoom[]>(`/admin/rooms${qs}`);
}

export async function createRoom(data: CreateRoomPayload): Promise<AdminRoom> {
  return api.post<AdminRoom>("/admin/rooms", data);
}

export async function uploadRoomImage(
  roomId: string,
  file: File
): Promise<AdminRoom> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${API_BASE_URL}/admin/rooms/${roomId}/images`;
  const res = await fetch(url, { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(
      (body as { message?: string })?.message ?? `Upload failed (${res.status})`
    );
  }
  return res.json() as Promise<AdminRoom>;
}
