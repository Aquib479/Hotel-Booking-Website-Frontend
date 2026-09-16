import { useEffect, useState } from "react";
import { getHotelById, getRoomsByHotel } from "@/features/hotels/api";
import type { Hotel, Room } from "@/features/hotels/types";
import {
  getWholesaleGuestPriceUsdRounded,
  type WholesaleQuote,
} from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { WHOLESALE_MARKUP_RATE } from "@/lib/currency/wholesale";
import {
  getBedbankHotelDetail,
  type BedbankHotelDetailResponse,
} from "@/services/bedbank";
import type { PropertyDetail } from "../types";
import type { Property } from "@/features/search/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

function toCurrencyCode(value: string | null | undefined): CurrencyCode {
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

/** Generic / useless values returned by MG as facility "names". */
const FACILITY_NOISE = new Set([
  "yes", "no", "normal", "none", "n/a", "null", "true", "false",
]);

function flattenFacilityNames(facilities: unknown): string[] {
  const names: string[] = [];
  const walk = (node: unknown) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    if (
      typeof obj.name === "string" &&
      !obj.facilityGroup &&
      !obj.facilityType &&
      !obj.facility
    ) {
      const label = obj.name.trim();
      if (
        label.length > 2 &&
        !FACILITY_NOISE.has(label.toLowerCase()) &&
        !label.startsWith("\"") &&
        !label.startsWith("<")
      ) {
        names.push(label);
      }
    }
    Object.values(obj).forEach(walk);
  };
  walk(facilities);
  return [...new Set(names)].slice(0, 24);
}

export interface WholesaleDetailOptions {
  nightlyAmount?: number;
  nightlyCurrency?: string | null;
  supplierName?: string | null;
}

function hotelToProperty(hotel: Hotel, rooms: Room[]): Property {
  const prices12h = rooms.map((r) => r.price12h).filter((p) => p > 0);
  const prices24h = rooms.map((r) => r.price24h).filter((p) => p > 0);
  const minPrice12h = prices12h.length ? Math.min(...prices12h) : 0;
  const minPrice24h = prices24h.length ? Math.min(...prices24h) : 0;
  const roomTypes = [...new Set(rooms.map((r) => r.roomType).filter(Boolean))];
  const allAmenities = [...new Set(rooms.flatMap((r) => r.amenities))];
  const maxOccupancy = rooms.length ? Math.max(...rooms.map((r) => r.maxOccupancy)) : 2;

  return {
    id: hotel.id,
    title: hotel.name,
    address: hotel.address ?? "",
    city: hotel.city ?? "",
    country: hotel.country ?? "",
    image: hotel.imageUrl ?? FALLBACK_IMAGE,
    rating: hotel.rating ?? 4.0,
    starRating: Math.round(hotel.rating ?? 4),
    lane: "direct",
    priceUsd: 0,
    priceIdr: minPrice12h || minPrice24h,
    roomType: (roomTypes[0] ?? "double") as Property["roomType"],
    maxOccupancy,
    amenities: allAmenities as Property["amenities"],
    category: "all",
    latitude: hotel.latitude,
    longitude: hotel.longitude,
    distanceFromAirportKm: -1,
    slotDuration: minPrice12h > 0 ? "12h" : "24h",
    timezone: "Asia/Jakarta",
    createdAt: hotel.createdAt,
  };
}

function buildPropertyDetail(hotel: Hotel, rooms: Room[]): PropertyDetail {
  const base = hotelToProperty(hotel, rooms);
  const images = hotel.imageUrls.length > 0
    ? hotel.imageUrls
    : [hotel.imageUrl ?? FALLBACK_IMAGE];

  const roomTypeLabels = [...new Set(rooms.map((r) => r.roomType).filter(Boolean))];
  const highlights: string[] = [];
  if (hotel.rating) highlights.push(`${hotel.rating}-star rated hotel`);
  if (roomTypeLabels.length) highlights.push(`Room types: ${roomTypeLabels.join(", ")}`);
  highlights.push(hotel.source === "direct"
    ? "RestHalf Exclusive · instant confirmation"
    : `Partner rate via ${hotel.source}`);
  if (rooms.length > 0) highlights.push(`${rooms.length} room${rooms.length !== 1 ? "s" : ""} available`);

  const allAmenities = [...new Set(rooms.flatMap((r) => r.amenities))];
  const iconMap: Record<string, string> = {
    WiFi: "wifi", AC: "sun", Pool: "waves", Breakfast: "utensils", Gym: "dumbbell",
  };

  return {
    ...base,
    region: [hotel.city, hotel.country].filter(Boolean).join(", "),
    displayTitle: hotel.address ?? hotel.name,
    reviewCount: 0,
    images,
    photoCount: images.length,
    description: `${hotel.name} offers comfortable accommodation${hotel.city ? ` in ${hotel.city}` : ""}. Rooms feature quality bedding and essential amenities for a restful stay.`,
    highlights,
    detailAmenities: allAmenities.map((label) => ({
      icon: iconMap[label] ?? "sparkles",
      label,
    })),
    hotelInfo: {
      name: hotel.name,
      logo: hotel.imageUrl ?? undefined,
      phone: "",
      email: "",
      starRating: Math.round(hotel.rating ?? 4),
    },
    policies: [
      "Slot check-in at selected time window",
      "Flexible slot changes up to 2 hours before arrival",
      "No smoking in rooms",
      "Valid ID required at check-in",
    ],
    reviews: [],
    mapImage: "",
    latitude: hotel.latitude,
    longitude: hotel.longitude,
  };
}

function buildWholesaleDetail(
  hotelCode: string,
  data: BedbankHotelDetailResponse,
  options?: WholesaleDetailOptions,
): PropertyDetail {
  const hotel = data.hotel;
  if (!hotel?.name) {
    throw new Error(data.errorMessage || "Partner hotel not found");
  }

  const city = hotel.address?.cityName ?? "";
  const country = hotel.address?.countryName ?? "";
  const addressLine = [hotel.address?.address1, hotel.address?.address2]
    .filter(Boolean)
    .join(", ");
  const address =
    addressLine || [city, country].filter(Boolean).join(", ");
  const rating = parseFloat(hotel.rating ?? "") || 4;
  const facilityNames = flattenFacilityNames(hotel.facilities);
  const mgRooms = hotel.roomsDetails?.roomDetails ?? [];
  const roomNames = mgRooms
    .map((r) => r.roomName)
    .filter((n): n is string => Boolean(n));

  const nightlyAmount = options?.nightlyAmount;
  const supplierCurrency = toCurrencyCode(options?.nightlyCurrency);
  const wholesalePricing: WholesaleQuote | undefined =
    nightlyAmount && nightlyAmount > 0
      ? {
          supplierBaseAmount: nightlyAmount,
          supplierCurrency,
          markupRate: WHOLESALE_MARKUP_RATE,
        }
      : undefined;

  const supplierName = options?.supplierName || "MG";
  const images = [FALLBACK_IMAGE];

  return {
    id: hotel.hotelCode || hotelCode,
    title: hotel.name,
    address,
    city,
    country,
    image: FALLBACK_IMAGE,
    rating,
    starRating: Math.round(rating),
    lane: "wholesale",
    priceUsd: wholesalePricing
      ? getWholesaleGuestPriceUsdRounded(wholesalePricing)
      : 0,
    priceIdr:
      wholesalePricing && supplierCurrency === "IDR"
        ? nightlyAmount!
        : 0,
    wholesalePricing,
    roomType: "double",
    maxOccupancy: Math.max(
      ...mgRooms.map((r) => r.maxOccupancy ?? 0),
      2,
    ),
    amenities: [],
    category: "all",
    latitude: hotel.geoLocation?.latitude ?? null,
    longitude: hotel.geoLocation?.longitude ?? null,
    distanceFromAirportKm: -1,
    slotDuration: "24h",
    timezone: "Asia/Jakarta",
    supplierName,
    createdAt: new Date().toISOString(),
    region: [city, country].filter(Boolean).join(", "),
    displayTitle: hotel.name,
    reviewCount: 0,
    images,
    photoCount: 1,
    description: `${hotel.name} is a partner hotel${
      city ? ` in ${city}` : ""
    }. Rates and availability are provided by ${supplierName}. Photos may be limited until content sync is enabled.`,
    highlights: [
      `${Math.round(rating)}-star partner hotel`,
      `Book via ${supplierName}`,
      ...(roomNames.slice(0, 3).map((n) => `Room: ${n}`)),
    ],
    detailAmenities: facilityNames.slice(0, 12).map((label) => ({
      icon: "sparkles",
      label,
    })),
    hotelInfo: {
      name: hotel.name,
      phone: hotel.reservation?.telephone ?? "",
      email: hotel.reservation?.email ?? "",
      starRating: Math.round(rating),
    },
    policies: [
      "Partner rates are subject to supplier confirmation",
      "Cancellation policy varies by room rate",
      "Valid ID required at check-in",
    ],
    reviews: [],
    mapImage: "",
  };
}

interface UsePropertyDetailResult {
  property: PropertyDetail | null;
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
}

export function usePropertyDetail(
  id: string | undefined,
  wholesaleOptions?: WholesaleDetailOptions,
): UsePropertyDetailResult {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nightlyAmount = wholesaleOptions?.nightlyAmount;
  const nightlyCurrency = wholesaleOptions?.nightlyCurrency ?? null;
  const supplierName = wholesaleOptions?.supplierName ?? null;

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const load = async () => {
      if (!isUuid(id)) {
        const data = await getBedbankHotelDetail(id);
        if (cancelled) return;
        if (data.status === false || !data.hotel) {
          setProperty(null);
          setError(data.errorMessage || "Partner hotel not found");
          setRooms([]);
          return;
        }
        setProperty(
          buildWholesaleDetail(id, data, {
            nightlyAmount,
            nightlyCurrency,
            supplierName,
          }),
        );
        setRooms([]);
        return;
      }

      const [hotel, fetchedRooms] = await Promise.all([
        getHotelById(id),
        getRoomsByHotel(id),
      ]);
      if (cancelled) return;
      if (!hotel) {
        setProperty(null);
        setError("Hotel not found");
        setRooms([]);
      } else {
        setProperty(buildPropertyDetail(hotel, fetchedRooms));
        setRooms(fetchedRooms);
      }
    };

    load()
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load hotel");
        setProperty(null);
        setRooms([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, nightlyAmount, nightlyCurrency, supplierName]);

  return { property, rooms, isLoading, error };
}
