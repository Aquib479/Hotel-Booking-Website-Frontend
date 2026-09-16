import { useQuery } from "@tanstack/react-query";
import { format, addDays } from "date-fns";
import { api } from "@/services/api";
import { normalizeStayDates } from "@/lib/booking/stayDates";
import {
  getWholesaleGuestPriceUsdRounded,
} from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { WHOLESALE_MARKUP_RATE } from "@/lib/currency/wholesale";
import { resolvePropertyCoordinates } from "../map-coordinates";
import type { Property } from "../types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

/* ---------- MG response shapes ---------- */

interface MgRoom {
  roomNo: number;
  rateKey: string;
  noOfAdults: number;
  noOfChild: number;
  netPrice: number;
  grossPrice: number;
}

interface MgRoomDetail {
  code: string;
  name: string;
  mealPlan: string;
  mealPlanName: string;
  cancellationPolicyType: string;
  netPrice: number;
  grossPrice: number;
  avgNightPrice: number;
  availFlag: boolean;
  canHold: boolean;
  rooms: { room: MgRoom[] };
  packageRate: boolean;
}

interface MgHotel {
  code: string;
  name: string;
  rating: string;
  latitude: string;
  longitude: string;
  roomDetails: MgRoomDetail[];
}

interface MgSearchResponse {
  status: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  noOfHotels: number;
  sessionID: string;
  checkIn: string;
  checkOut: string;
  currency: string;
  hotels?: { hotel: MgHotel[] };
}

function toCurrencyCode(value: string | undefined): CurrencyCode {
  const upper = (value ?? "IDR").toUpperCase();
  if (
    upper === "USD" ||
    upper === "IDR" ||
    upper === "EUR" ||
    upper === "GBP" ||
    upper === "SGD" ||
    upper === "MYR" ||
    upper === "AUD"
  ) {
    return upper;
  }
  return "IDR";
}

/* ---------- mapper ---------- */

function mapMgHotelToProperty(
  hotel: MgHotel,
  currency: string,
  location?: { city?: string; country?: string },
): Property {
  const rating = parseFloat(hotel.rating) || 4;
  const lat = parseFloat(hotel.latitude) || null;
  const lng = parseFloat(hotel.longitude) || null;
  const city = location?.city ?? "";
  const country = location?.country ?? "";

  const coords = resolvePropertyCoordinates({
    id: hotel.code,
    city,
    latitude: lat,
    longitude: lng,
  });

  const cheapestRoom =
    hotel.roomDetails.reduce(
      (best, rd) =>
        (rd.avgNightPrice || rd.netPrice) <
        ((best?.avgNightPrice || best?.netPrice) ?? Number.POSITIVE_INFINITY)
          ? rd
          : best,
      hotel.roomDetails[0],
    ) ?? hotel.roomDetails[0];

  const nightly =
    cheapestRoom?.avgNightPrice ||
    cheapestRoom?.netPrice ||
    0;

  const supplierCurrency = toCurrencyCode(currency);
  const wholesalePricing = {
    supplierBaseAmount: nightly,
    supplierCurrency,
    markupRate: WHOLESALE_MARKUP_RATE,
  };

  const roomName = cheapestRoom?.name?.toLowerCase() ?? "double";
  const roomType = roomName.includes("suite")
    ? "suite"
    : roomName.includes("family")
      ? "family"
      : roomName.includes("single")
        ? "single"
        : "double";

  const maxOccupancy = Math.max(
    ...hotel.roomDetails.flatMap((rd) =>
      rd.rooms.room.map((r) => r.noOfAdults + r.noOfChild),
    ),
    2,
  );

  return {
    id: hotel.code,
    title: hotel.name,
    address: [city, country].filter(Boolean).join(", "),
    city,
    country,
    image: FALLBACK_IMAGE,
    rating,
    starRating: Math.round(rating),
    lane: "wholesale",
    priceUsd: getWholesaleGuestPriceUsdRounded(wholesalePricing),
    priceIdr: supplierCurrency === "IDR" ? nightly : 0,
    wholesalePricing,
    roomType: roomType as Property["roomType"],
    maxOccupancy,
    amenities: [],
    category: "all",
    latitude: coords?.lat ?? null,
    longitude: coords?.lng ?? null,
    distanceFromAirportKm: -1,
    slotDuration: "24h",
    timezone: "Asia/Jakarta",
    supplierName: "MG",
    createdAt: new Date().toISOString(),
  };
}

/* ---------- request builder ---------- */

function parseGuestCount(guestsLabel: string): number {
  const match = guestsLabel.match(/(\d+)/);
  return match ? Number(match[1]) : 2;
}

interface BedbankSearchParams {
  destinationId: string;
  checkIn?: Date;
  checkOut?: Date;
  guests: string;
  city?: string;
  country?: string;
}

function buildBedbankBody(params: BedbankSearchParams) {
  const { checkIn, checkOut } = normalizeStayDates(
    params.checkIn ?? addDays(new Date(), 14),
    params.checkOut,
  );
  const adults = parseGuestCount(params.guests);

  return {
    destinationId: params.destinationId,
    Nationality: "ID",
    CheckIn: format(checkIn, "yyyy-MM-dd"),
    CheckOut: format(checkOut, "yyyy-MM-dd"),
    Rooms: {
      Room: [
        {
          RoomNo: "1",
          NoOfAdults: String(adults),
          NoOfChild: "",
          Child1Age: "",
          Child2Age: "",
          ExtraBed: false,
        },
      ],
    },
    Hotels: { Code: [""] },
    Currency: "IDR",
    Language: "En",
    AvailFlag: true,
    DetailLevel: "FULL",
    MaxNoOfHotel: 50,
  };
}

/* ---------- hook ---------- */

export function useBedbankSearch(params: BedbankSearchParams | null) {
  return useQuery({
    queryKey: [
      "bedbank-search",
      params?.destinationId,
      params?.checkIn?.toISOString(),
      params?.checkOut?.toISOString(),
      params?.guests,
    ],
    queryFn: async (): Promise<Property[]> => {
      if (!params) return [];
      const body = buildBedbankBody(params);
      const data = await api.post<MgSearchResponse>("/bedbank/search", body);
      if (!data.status || !data.hotels?.hotel) return [];
      return data.hotels.hotel.map((h) =>
        mapMgHotelToProperty(h, data.currency, {
          city: params.city,
          country: params.country,
        }),
      );
    },
    enabled: !!params?.destinationId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
