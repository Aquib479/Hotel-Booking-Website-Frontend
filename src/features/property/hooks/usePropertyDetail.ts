import { useEffect, useState } from "react";
import { getHotelById, getRoomsByHotel } from "@/features/hotels/api";
import type { Hotel, Room } from "@/features/hotels/types";
import type { PropertyDetail } from "../types";
import type { Property } from "@/features/search/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

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
    distanceFromAirportKm: 0,
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

interface UsePropertyDetailResult {
  property: PropertyDetail | null;
  rooms: Room[];
  isLoading: boolean;
  error: string | null;
}

export function usePropertyDetail(id: string | undefined): UsePropertyDetailResult {
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([getHotelById(id), getRoomsByHotel(id)])
      .then(([hotel, fetchedRooms]) => {
        if (cancelled) return;
        if (!hotel) {
          setProperty(null);
          setError("Hotel not found");
        } else {
          setProperty(buildPropertyDetail(hotel, fetchedRooms));
          setRooms(fetchedRooms);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load hotel");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  return { property, rooms, isLoading, error };
}
