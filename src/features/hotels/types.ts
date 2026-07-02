export interface Hotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
}

export interface HotelSearchParams {
  query?: string;
  location?: string;
}
