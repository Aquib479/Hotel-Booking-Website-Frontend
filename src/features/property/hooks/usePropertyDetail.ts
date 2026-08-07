import { useEffect, useState } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useCurrency } from "@/context/CurrencyContext";
import { getHotelById, getRoomsByHotel } from "@/features/hotels/api";
import type { Hotel, Room } from "@/features/hotels/types";
import type { PropertyDetail } from "../types";
import type { Property } from "@/features/search/types";
import { getHotelContent, isZentrumConfigured } from "@/services/zentrumhub";
import { useHotelStore, useSearchStore } from "@/store";

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
  const images =
    hotel.imageUrls.length > 0
      ? hotel.imageUrls
      : [hotel.imageUrl ?? FALLBACK_IMAGE];

  const roomTypeLabels = [...new Set(rooms.map((r) => r.roomType).filter(Boolean))];
  const highlights: string[] = [];
  if (hotel.rating) highlights.push(`${hotel.rating}-star rated hotel`);
  if (roomTypeLabels.length) highlights.push(`Room types: ${roomTypeLabels.join(", ")}`);
  highlights.push(
    hotel.source === "direct"
      ? "RestHalf Exclusive · instant confirmation"
      : `Partner rate via ${hotel.source}`
  );
  if (rooms.length > 0)
    highlights.push(`${rooms.length} room${rooms.length !== 1 ? "s" : ""} available`);

  const allAmenities = [...new Set(rooms.flatMap((r) => r.amenities))];
  const iconMap: Record<string, string> = {
    WiFi: "wifi",
    Wifi: "wifi",
    AC: "wind",
    Pool: "waves",
    Breakfast: "utensils",
    Gym: "dumbbell",
    Parking: "parking",
  };

  return {
    ...base,
    region: [hotel.city, hotel.country].filter(Boolean).join(", "),
    displayTitle: hotel.address ?? hotel.name,
    reviewCount: 0,
    images,
    photoCount: images.length,
    description: `${hotel.name} offers comfortable accommodation${
      hotel.city ? ` in ${hotel.city}` : ""
    }. Rooms feature quality bedding and essential amenities for a restful stay.`,
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

function buildZentrumPropertyDetail(
  hotelId: string,
  content: NonNullable<ReturnType<typeof useSearchStore.getState>["contentById"][string]> | undefined,
  searchHotel: ReturnType<typeof useSearchStore.getState>["hotels"][number] | undefined
): PropertyDetail {
  const name = content?.name?.trim() || searchHotel?.name || `Hotel ${hotelId}`;
  const address = content?.contact?.address;
  const imagesFromContent =
    content?.images
      ?.flatMap((img) => {
        const linkUrls = (img.links ?? []).map((l) => l.url).filter(Boolean) as string[];
        return img.url ? [img.url, ...linkUrls] : linkUrls;
      })
      .filter((u): u is string => Boolean(u)) ?? [];
  const images = [
    content?.heroImage,
    searchHotel?.image && !searchHotel.image.includes("unsplash") ? searchHotel.image : null,
    ...imagesFromContent,
  ].filter((u): u is string => Boolean(u));
  const uniqueImages = [...new Set(images.length ? images : [FALLBACK_IMAGE])];
  const facilities = (content?.facilities ?? [])
    .map((f) => f.name)
    .filter((n): n is string => Boolean(n));
  const description =
    content?.descriptions?.find((d) => d.text)?.text ||
    `${name} offers comfortable accommodation${
      address?.city?.name ? ` in ${address.city.name}` : ""
    }.`;

  const reviewObj =
    content?.reviews && !Array.isArray(content.reviews) ? content.reviews : null;
  const rating =
    Number(reviewObj?.rating ?? 0) ||
    Number(content?.starRating ?? 0) ||
    searchHotel?.rating ||
    4;
  const starRating = Math.round(Number(content?.starRating ?? rating) || rating);
  const reviewCount = Number(reviewObj?.count ?? 0) || 0;

  const criteria = useSearchStore.getState().criteria;
  let nights = 1;
  if (criteria?.checkIn && criteria?.checkOut) {
    try {
      nights = Math.max(
        1,
        differenceInCalendarDays(parseISO(criteria.checkOut), parseISO(criteria.checkIn))
      );
    } catch {
      nights = 1;
    }
  }
  const totalRate = searchHotel?.totalRate ?? 0;
  const perNight = totalRate > 0 ? totalRate / nights : 0;
  const priceCurrency = searchHotel?.currency;

  return {
    id: hotelId,
    title: name,
    address: address?.line1 ?? searchHotel?.address ?? "",
    city: address?.city?.name ?? searchHotel?.city ?? "",
    country: address?.country?.name ?? searchHotel?.country ?? "",
    image: uniqueImages[0],
    rating,
    starRating,
    lane: "wholesale",
    priceAmount: perNight,
    priceCurrency,
    priceUsd: perNight,
    priceIdr: 0,
    roomType: "double",
    maxOccupancy: 2,
    amenities: facilities as Property["amenities"],
    category: "all",
    latitude: content?.geoCode?.lat ?? searchHotel?.latitude ?? null,
    longitude: content?.geoCode?.long ?? searchHotel?.longitude ?? null,
    distanceFromAirportKm: 0,
    slotDuration: "24h",
    timezone: "UTC",
    supplierName: "ZentrumHub",
    createdAt: new Date().toISOString(),
    region: [address?.city?.name, address?.country?.name].filter(Boolean).join(", "),
    displayTitle: name,
    reviewCount,
    images: uniqueImages,
    photoCount: uniqueImages.length,
    description,
    highlights: [
      starRating ? `${starRating}-star property` : "Partner hotel",
      searchHotel?.refundable ? "Refundable rates available" : "See rate policies at checkout",
      searchHotel?.freeBreakfast ? "Free breakfast options" : "Multiple board bases",
    ],
    detailAmenities: facilities.slice(0, 12).map((label) => ({
      icon: "sparkles",
      label,
    })),
    hotelInfo: {
      name,
      logo: uniqueImages[0],
      phone: content?.contact?.phones?.[0] ?? "",
      email: content?.contact?.emails?.[0] ?? "",
      starRating,
    },
    policies: [
      "Rates confirmed at pricing step before payment",
      "Cancellation rules vary by rate plan",
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
  isZentrum: boolean;
}

export function usePropertyDetail(id: string | undefined): UsePropertyDetailResult {
  const { currency } = useCurrency();
  const searchToken = useSearchStore((s) => s.token);
  const loadRoomsAndRates = useHotelStore((s) => s.loadRoomsAndRates);
  const roomsRatesStatus = useHotelStore((s) => s.status);

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isZentrum = Boolean(id && isZentrumConfigured() && searchToken);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    async function load() {
      const token = useSearchStore.getState().token;
      const zentrumSession = Boolean(isZentrumConfigured() && token);

      if (zentrumSession) {
        const { contentById, hotels, correlationId } = useSearchStore.getState();
        let content: (typeof contentById)[string] | undefined = contentById[id!];
        if (!content) {
          try {
            const { data } = await getHotelContent([id!], {
              correlationId: correlationId ?? undefined,
            });
            content = data.hotels?.[0];
          } catch {
            /* optional */
          }
        }

        const searchHotel = hotels.find((h) => h.id === id);
        if (!cancelled) {
          setProperty(buildZentrumPropertyDetail(id!, content, searchHotel));
          setRooms([]);
          setIsLoading(false);
        }
        void loadRoomsAndRates(id!, { currency });
        return;
      }

      try {
        const [hotel, fetchedRooms] = await Promise.all([
          getHotelById(id!),
          getRoomsByHotel(id!),
        ]);
        if (cancelled) return;
        if (!hotel) {
          setProperty(null);
          setError("Hotel not found");
        } else {
          setProperty(buildPropertyDetail(hotel, fetchedRooms));
          setRooms(fetchedRooms);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load hotel");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id, isZentrum, loadRoomsAndRates, currency]);

  return {
    property,
    rooms,
    isLoading: isLoading || (isZentrum && roomsRatesStatus === "loading"),
    error,
    isZentrum,
  };
}
