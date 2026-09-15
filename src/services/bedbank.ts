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
