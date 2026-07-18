import { MOCK_PROPERTIES } from "@/features/search/constants";
import type { Property } from "@/features/search/types";
import type { PropertyDetail } from "./types";

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${Math.round(w * 0.75)}&fit=crop`;

function buildAmenities(property: Property) {
  const iconMap: Record<string, string> = {
    WiFi: "wifi",
    AC: "sun",
    Pool: "waves",
    "Airport shuttle": "plane",
    Breakfast: "utensils",
    Gym: "dumbbell",
  };

  return property.amenities.map((label) => ({
    icon: iconMap[label] ?? "sparkles",
    label,
  }));
}

const DEFAULT_DESCRIPTION =
  "A well-appointed hotel designed for travelers who need flexible rest between flights or a comfortable overnight stay. Rooms feature quality bedding, reliable Wi-Fi, and easy access to transit links.";

function buildHighlights(property: Property): string[] {
  const highlights = [
    `${property.starRating}-star hotel · ${property.roomType} rooms`,
    `${property.distanceFromAirportKm} km from nearest airport`,
  ];

  if (property.lane === "direct") {
    highlights.push(
      "RestHalf Exclusive · instant confirmation",
      property.ringFencedRooms
        ? `${property.ringFencedRooms} rooms ring-fenced for RestHalf guests`
        : "Dedicated RestHalf inventory"
    );
  } else {
    highlights.push(
      `Partner rate via ${property.supplierName ?? "supplier"}`,
      "Complete booking on partner site after checkout"
    );
  }

  return highlights;
}

function buildHotelInfo(property: Property) {
  return {
    name: property.title,
    logo: property.image,
    phone: "+1 (800) 555-0199",
    email: "reservations@resthalf.com",
    starRating: property.starRating,
    supplierName: property.supplierName,
  };
}

function buildGallery(base: Property): string[] {
  return [
    base.image,
    img("photo-1600585154340-be6161a56a0c", 500),
    img("photo-1600607687939-ce8a6c25118c", 500),
    img("photo-1600047509358-9dc75507daeb", 500),
    img("photo-1605276374104-dee2a0ed3cd6", 500),
  ];
}

function buildReviews(property: Property) {
  return [
    {
      id: "r1",
      author: "Sarah Mitchell",
      avatar: img("photo-1494790108377-be9c29b29330", 80),
      date: "January 2026",
      rating: 5,
      comment: `Perfect for my layover — ${property.title} was clean, quiet, and exactly as described.`,
    },
    {
      id: "r2",
      author: "James Chen",
      avatar: img("photo-1507003211169-0a1dd7228f2d", 80),
      date: "December 2025",
      rating: 5,
      comment: "Great location near the airport. The 12-hour rest slot was ideal between connections.",
    },
    {
      id: "r3",
      author: "Emily Rodriguez",
      avatar: img("photo-1438761681033-6461ffad8d80", 80),
      date: "November 2025",
      rating: 4,
      comment: "Comfortable stay overall. Would book again for our next trip.",
    },
  ];
}

export function getPropertyById(id: string): PropertyDetail | null {
  const base = MOCK_PROPERTIES.find((p) => p.id === id);
  if (!base) return null;

  return {
    ...base,
    region: `${base.city}, ${base.country}`,
    displayTitle: base.address,
    reviewCount: 28,
    images: buildGallery(base),
    photoCount: 24,
    description: DEFAULT_DESCRIPTION,
    highlights: buildHighlights(base),
    detailAmenities: buildAmenities(base),
    hotelInfo: buildHotelInfo(base),
    policies: [
      base.lane === "direct"
        ? "Slot check-in at selected time window"
        : "Standard hotel check-in after 3:00 PM",
      base.lane === "direct"
        ? "Flexible slot changes up to 2 hours before arrival"
        : "Checkout before 11:00 AM",
      "No smoking in rooms",
      "Valid ID required at check-in",
      "Quiet hours from 10:00 PM to 7:00 AM",
    ],
    reviews: buildReviews(base),
    mapImage: img("photo-1524661135-423995f22d0b", 1200),
    latitude: null,
    longitude: null,
  };
}

export const GUEST_OPTIONS = ["1 adult", "2 adults", "3 adults", "4 adults", "5+ adults"] as const;

export const DETAIL_TABS = [
  { id: "details" as const, label: "Hotel details" },
  { id: "policies" as const, label: "Policies" },
  { id: "reviews" as const, label: "Reviews" },
  { id: "messages" as const, label: "Support" },
];
