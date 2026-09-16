import { api } from "./api";

export type BedbankSearchRoom = {
  RoomNo: string;
  NoOfAdults: string;
  NoOfChild?: string;
  Child1Age?: string;
  Child2Age?: string;
  ExtraBed: boolean;
};

export type BedbankSearchRequest = {
  destinationId?: string;
  Nationality?: string;
  Country?: string;
  City?: string;
  Hotels?: { Code: string[] };
  CheckIn: string;
  CheckOut: string;
  Rooms: { Room: BedbankSearchRoom[] };
  Currency?: string;
  Language?: string;
  AvailFlag?: boolean;
  DetailLevel?: string;
  MaxNoOfHotel?: number;
};

export type BedbankHotelDetailResponse = {
  status?: boolean;
  errorCode?: string | null;
  errorMessage?: string | null;
  sessionID?: string;
  hotel?: {
    hotelCode?: string;
    name?: string;
    rating?: string;
    address?: {
      address1?: string;
      address2?: string;
      zipCode?: string;
      countryCode?: string;
      countryName?: string;
      cityCode?: string;
      cityName?: string;
    };
    geoLocation?: {
      latitude?: number;
      longitude?: number;
    };
    reservation?: {
      telephone?: string;
      email?: string;
    };
    website?: string;
    facilities?: unknown[];
    roomsDetails?: {
      roomDetails?: Array<{
        roomCode?: string;
        roomName?: string;
        maxOccupancy?: number;
        maxAdults?: number;
        maxChildren?: number;
        isSmokingAllowed?: boolean;
        roomSize?: string | null;
        facilities?: unknown[];
      }>;
    };
  };
};

/**
 * Wholesale hotel search. Prefer destinationId from autocomplete;
 * the API resolves Country/City for the active supplier.
 */
export function searchBedbankHotels(body: BedbankSearchRequest) {
  return api.post<unknown>("/bedbank/search", {
    Nationality: "ID",
    Currency: "IDR",
    Language: "En",
    AvailFlag: true,
    DetailLevel: "FULL",
    Hotels: { Code: [""] },
    ...body,
  });
}

/** Content/detail for an MG hotel code (not a RestHalf UUID). */
export function getBedbankHotelDetail(hotelCode: string) {
  return api.post<BedbankHotelDetailResponse>("/bedbank/hotel/detail", {
    HotelCode: hotelCode,
  });
}
