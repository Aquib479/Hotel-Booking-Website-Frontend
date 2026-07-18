/** Matches RestHalfV2 Hotel entity from GET /hotels */
export interface Hotel {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  country: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  source: string;
  externalId: string | null;
  isActive: boolean;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: string;
}

/** Matches RestHalfV2 Room entity from GET /hotels/:id/rooms */
export interface Room {
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
  createdAt: string;
}

export interface HotelSearchParams {
  query?: string;
  city?: string;
}
