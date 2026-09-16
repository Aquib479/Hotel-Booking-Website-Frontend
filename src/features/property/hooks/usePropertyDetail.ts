import { useEffect, useState } from "react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
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
import type { PropertyDetail, Review } from "../types";
import type { Property } from "@/features/search/types";
import {
  getGuestReviews,
  getHotelContent,
  isZentrumConfigured,
  type HotelContentGuestReview,
  type HotelContentItem,
  type GuestReviewDetail,
} from "@/services/zentrumhub";
import { useHotelStore, useSearchStore } from "@/store";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";

/** MG hotel codes look like ID10002458 — not UUIDs / Zentrum ids. */
const MG_HOTEL_CODE_RE = /^[A-Z]{2}\d{5,}$/i;

function isMgHotelCode(id: string): boolean {
  return MG_HOTEL_CODE_RE.test(id);
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
  const address = addressLine || [city, country].filter(Boolean).join(", ");
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
      wholesalePricing && supplierCurrency === "IDR" ? nightlyAmount! : 0,
    wholesalePricing,
    roomType: "double",
    maxOccupancy: Math.max(...mgRooms.map((r) => r.maxOccupancy ?? 0), 2),
    amenities: [],
    amenityPills: [],
    highlightAttributes: [],
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
    images: [FALLBACK_IMAGE],
    photoCount: 1,
    description: `${hotel.name} is a partner hotel${
      city ? ` in ${city}` : ""
    }. Rates and availability are provided by ${supplierName}. Photos may be limited until content sync is enabled.`,
    highlights: [
      `${Math.round(rating)}-star partner hotel`,
      `Book via ${supplierName}`,
      ...roomNames.slice(0, 3).map((n) => `Room: ${n}`),
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
      supplierName,
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

function mapContentGuestReviews(
  snippets: HotelContentGuestReview[] | null | undefined
): Review[] {
  if (!snippets?.length) return [];
  return snippets.flatMap((item, index) => {
    const author =
      item.ReviewerName?.trim() ||
      item.reviewerName?.trim() ||
      "hotel.guest";
    const title = item.Title?.trim() || item.title?.trim() || "";
    const text = item.Text?.trim() || item.text?.trim() || "";
    const comment = text || title;
    if (!comment) return [];
    const rating = Number(item.Rating ?? item.rating ?? 0) || 0;
    const source = item.Source?.trim() || item.source?.trim() || undefined;
    const review: Review = {
      id: `content-review-${index}`,
      author,
      date: source ? `hotel.viaSource|${source}` : "hotel.guestReview",
      rating,
      comment,
      title: title && text ? title : undefined,
      source,
    };
    return [review];
  });
}

function mapGuestReviewDetails(details: GuestReviewDetail[] | null | undefined): Review[] {
  if (!details?.length) return [];
  return details.flatMap((item, index) => {
    const author = item.reviewer?.name?.trim() || "hotel.guest";
    const title = item.title?.trim() || "";
    const summary = item.summary?.trim() || "";
    const paragraphs = (item.text ?? [])
      .map((line) => line?.trim())
      .filter((line): line is string => Boolean(line));
    const comment = paragraphs.join("\n\n") || summary || title;
    if (!comment && !title) return [];

    const rating = Number(item.score ?? 0) || 0;
    const date = item.dateSubmitted
      ? formatReviewDate(item.dateSubmitted)
      : "hotel.guestReview";

    const managementResponses = (item.managementResponses ?? [])
      .map((response) => {
        const text = response.text?.trim();
        if (!text) return null;
        return {
          text,
          date: response.date ? formatReviewDate(response.date) : "",
        };
      })
      .filter((r): r is { text: string; date: string } => Boolean(r));

    const review: Review = {
      id: `guest-review-${index}-${item.dateSubmitted ?? index}`,
      author,
      date,
      rating,
      comment,
      title: title || undefined,
      summary: summary && summary !== comment ? summary : undefined,
      paragraphs: paragraphs.length ? paragraphs : undefined,
      source: item.verificationSource?.trim() || undefined,
      country: item.reviewer?.country?.trim() || undefined,
      travelPurpose: item.reviewer?.travelPurpose?.trim() || undefined,
      travelerType: item.reviewer?.type?.trim() || undefined,
      managementResponses: managementResponses.length
        ? managementResponses
        : undefined,
    };
    return [review];
  });
}

function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function reviewsFromContent(content: HotelContentItem | null | undefined): Review[] {
  const reviewEntry = Array.isArray(content?.reviews)
    ? content?.reviews[0]
    : content?.reviews;
  return mapContentGuestReviews(reviewEntry?.guestreviews);
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
    reviewCount: 0,
    starRating: Math.round(hotel.rating ?? 4),
    lane: "direct",
    priceUsd: 0,
    priceIdr: minPrice12h || minPrice24h,
    roomType: (roomTypes[0] ?? "double") as Property["roomType"],
    maxOccupancy,
    amenities: allAmenities as Property["amenities"],
    amenityPills: allAmenities.slice(0, 6),
    highlightAttributes: [],
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
  if (hotel.rating) highlights.push(`hotel.hl.starRated|${hotel.rating}`);
  if (roomTypeLabels.length) highlights.push(`hotel.hl.roomTypes|${roomTypeLabels.join(", ")}`);
  highlights.push(
    hotel.source === "direct"
      ? "hotel.hl.exclusiveInstant"
      : `hotel.hl.partnerVia|${hotel.source}`
  );
  if (rooms.length > 0)
    highlights.push(
      rooms.length === 1
        ? `hotel.hl.roomAvailable|${rooms.length}`
        : `hotel.hl.roomsAvailable|${rooms.length}`
    );

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
    description: hotel.city
      ? `hotel.descFallbackCity|${hotel.city}`
      : "hotel.descFallback",
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
      "hotel.pol.slotCheckin",
      "hotel.pol.flexibleSlot",
      "hotel.pol.noSmoking",
      "hotel.pol.validId",
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
    (address?.city?.name
      ? `hotel.descShortCity|${address.city.name}`
      : "hotel.descShort");

  const reviewEntry = Array.isArray(content?.reviews)
    ? content?.reviews[0]
    : content?.reviews;
  const rating =
    Number(reviewEntry?.rating ?? reviewEntry?.Rating ?? 0) ||
    searchHotel?.rating ||
    0;
  const starRatingRaw = Number(content?.starRating ?? 0);
  const starRating =
    Number.isFinite(starRatingRaw) && starRatingRaw > 0
      ? Math.min(5, starRatingRaw)
      : searchHotel?.starRating || 0;
  const reviewCount =
    Number(reviewEntry?.count ?? 0) || searchHotel?.reviewCount || 0;

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
    totalStayAmount: totalRate > 0 ? totalRate : undefined,
    publishedStayAmount:
      searchHotel?.publishedRate && searchHotel.publishedRate > totalRate
        ? searchHotel.publishedRate
        : undefined,
    priceUsd: perNight,
    priceIdr: 0,
    roomType: "double",
    maxOccupancy: 2,
    amenities: (searchHotel?.amenities?.length
      ? searchHotel.amenities
      : facilities) as Property["amenities"],
    amenityPills: searchHotel?.amenityPills ?? facilities.slice(0, 6),
    freeBreakfast: searchHotel?.freeBreakfast,
    freeCancellation: searchHotel?.freeCancellation,
    refundable: searchHotel?.refundable,
    payAtHotel: searchHotel?.payAtHotel,
    boardBasisLabel: searchHotel?.boardBasisLabel,
    offerLabel: searchHotel?.offerLabel,
    highlightAttributes: searchHotel?.highlightAttributes ?? [],
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
      starRating ? `hotel.hl.starProperty|${starRating}` : "hotel.hl.partnerHotel",
      searchHotel?.refundable || searchHotel?.freeCancellation
        ? "hotel.hl.freeCancel"
        : "hotel.hl.seePolicies",
      searchHotel?.freeBreakfast || /breakfast/i.test(searchHotel?.boardBasisLabel ?? "")
        ? "hotel.hl.freeBreakfast"
        : "hotel.hl.boardBases",
      ...(searchHotel?.offerLabel ? [searchHotel.offerLabel] : []),
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
      starRating: Math.round(starRating) || starRating,
    },
    policies: [
      "hotel.pol.ratesConfirmed",
      "hotel.pol.cancelVary",
      "hotel.pol.validId",
    ],
    reviews: reviewsFromContent(content),
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

export function usePropertyDetail(
  id: string | undefined,
  wholesaleOptions?: WholesaleDetailOptions,
): UsePropertyDetailResult {
  const { currency } = useCurrency();
  const [searchParams] = useSearchParams();
  const urlCheckIn = searchParams.get("checkIn") ?? undefined;
  const urlCheckOut = searchParams.get("checkOut") ?? undefined;
  const searchToken = useSearchStore((s) => s.token);
  const searchStatus = useSearchStore((s) => s.status);
  const searchCurrency = useSearchStore((s) => s.currency);
  const hasSearchDates = useSearchStore((s) =>
    Boolean(s.criteria?.checkIn && s.criteria?.checkOut)
  );
  const repriceHotel = useSearchStore((s) => s.repriceHotel);
  const loadRoomsAndRates = useHotelStore((s) => s.loadRoomsAndRates);
  const roomsRatesStatus = useHotelStore((s) => s.status);

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMg = Boolean(id && isMgHotelCode(id));
  const isZentrum = Boolean(
    id &&
      !isMg &&
      isZentrumConfigured() &&
      (searchToken || hasSearchDates || (urlCheckIn && urlCheckOut))
  );

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

    async function load() {
      if (isMgHotelCode(id!)) {
        try {
          const data = await getBedbankHotelDetail(id!);
          if (cancelled) return;
          if (data.status === false || !data.hotel) {
            setProperty(null);
            setError(data.errorMessage || "hotel.notFound");
            setRooms([]);
            return;
          }
          setProperty(
            buildWholesaleDetail(id!, data, {
              nightlyAmount,
              nightlyCurrency,
              supplierName,
            }),
          );
          setRooms([]);
        } catch (err) {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "hotel.loadFail");
          setProperty(null);
          setRooms([]);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
        return;
      }

      const searchState = useSearchStore.getState();
      const checkIn = searchState.criteria?.checkIn || urlCheckIn;
      const checkOut = searchState.criteria?.checkOut || urlCheckOut;
      const hasZentrumSession = Boolean(
        isZentrumConfigured() && (searchState.token || (checkIn && checkOut))
      );

      if (hasZentrumSession) {
        // Search tokens are currency-scoped — re-init this hotel when currency changes.
        const needsReprice =
          searchState.currency !== currency ||
          !searchState.token ||
          searchState.status === "error";

        if (needsReprice) {
          await repriceHotel(id!, currency, { checkIn, checkOut });
          if (cancelled) return;
          const after = useSearchStore.getState();
          if (after.status === "error") {
            setError(after.error ?? "hotel.refreshFail");
            setIsLoading(false);
            return;
          }
        }

        const { contentById, hotels, correlationId, token } =
          useSearchStore.getState();
        if (!token) {
          if (!cancelled) {
            setError("hotel.noSearchToken");
            setIsLoading(false);
          }
          return;
        }

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
        const detail = buildZentrumPropertyDetail(id!, content, searchHotel);
        if (!cancelled) {
          setProperty((prev) =>
            prev?.reviews?.length && !detail.reviews.length
              ? { ...detail, reviews: prev.reviews }
              : detail
          );
          setRooms([]);
        }

        await loadRoomsAndRates(id!, { currency });
        if (cancelled) return;

        // Prefer dedicated guestReviews API (richer than nested content snippets).
        try {
          const { data } = await getGuestReviews(id!, {
            correlationId: correlationId ?? undefined,
            providerName: content?.providerName,
          });
          const guestReviews = mapGuestReviewDetails(data.reviews);
          if (!cancelled && guestReviews.length > 0) {
            setProperty((prev) =>
              prev ? { ...prev, reviews: guestReviews } : prev
            );
          }
        } catch {
          /* keep content snippets if guestReviews fails */
        }

        if (!cancelled) setIsLoading(false);
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
          setError("hotel.notFound");
        } else {
          setProperty(buildPropertyDetail(hotel, fetchedRooms));
          setRooms(fetchedRooms);
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "hotel.loadFail");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    id,
    loadRoomsAndRates,
    repriceHotel,
    currency,
    urlCheckIn,
    urlCheckOut,
    nightlyAmount,
    nightlyCurrency,
    supplierName,
  ]);

  // Keep property-level totals in sync when search hotel rates refresh (API currency).
  useEffect(() => {
    if (!id || !isZentrumConfigured()) return;
    const { hotels } = useSearchStore.getState();
    const searchHotel = hotels.find((h) => h.id === id);
    if (!searchHotel || searchHotel.currency !== currency) return;

    const nights = (() => {
      const criteria = useSearchStore.getState().criteria;
      if (!criteria?.checkIn || !criteria?.checkOut) return 1;
      try {
        return Math.max(
          1,
          differenceInCalendarDays(
            parseISO(criteria.checkOut),
            parseISO(criteria.checkIn)
          )
        );
      } catch {
        return 1;
      }
    })();
    const totalRate = searchHotel.totalRate ?? 0;
    const perNight = totalRate > 0 ? totalRate / nights : 0;

    setProperty((prev) => {
      if (!prev || prev.lane !== "wholesale") return prev;
      return {
        ...prev,
        priceAmount: perNight,
        priceCurrency: searchHotel.currency,
        totalStayAmount: totalRate > 0 ? totalRate : undefined,
        publishedStayAmount:
          searchHotel.publishedRate && searchHotel.publishedRate > totalRate
            ? searchHotel.publishedRate
            : undefined,
        priceUsd: perNight,
      };
    });
  }, [id, currency, searchCurrency, searchStatus, searchToken]);

  return {
    property,
    rooms,
    isLoading:
      isLoading ||
      (isZentrum &&
        (searchStatus === "init" ||
          searchStatus === "polling" ||
          roomsRatesStatus === "loading")),
    error,
    isZentrum,
  };
}
