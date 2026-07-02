import { MOCK_PROPERTIES } from "@/features/search/constants";
import type { Property } from "@/features/search/types";
import type { PropertyDetail } from "./types";

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${Math.round(w * 0.75)}&fit=crop`;

const DEFAULT_AMENITIES = [
  { icon: "maximize", label: "1600sq. feet space" },
  { icon: "map-pin", label: "2.6 mi away from city" },
  { icon: "sun", label: "Natural Lighting" },
  { icon: "sparkles", label: "Cleaning Service" },
  { icon: "paw", label: "Pet Friendly" },
  { icon: "utensils", label: "Buffet Food" },
];

const DEFAULT_HOST = {
  name: "Emmanuel Ackers",
  avatar: img("photo-1472099645785-5658abf4ff4e", 120),
  trips: 165,
  hostSince: 2021,
  responseRate: 100,
  responseTime: "within an hour",
};

const DEFAULT_DESCRIPTION =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const DEFAULT_HIGHLIGHTS = [
  "Entire home · You'll have the place to yourself",
  "Enhanced Clean · This host committed to enhanced cleaning",
  "Self check-in · Check yourself in with the keypad",
  "Free cancellation before 48 hours",
];

const DETAIL_OVERRIDES: Record<string, Partial<PropertyDetail>> = {
  "1": {
    region: "New York, NY, United States",
    displayTitle: "8502 Preston Rd. Inglewood, Maine 98380",
    reviewCount: 44,
    images: [
      img("photo-1613490493576-7fde63acd811", 900),
      img("photo-1600585154340-be6161a56a0c", 500),
      img("photo-1600607687939-ce8a6c25118c", 500),
      img("photo-1600047509358-9dc75507daeb", 500),
      img("photo-1605276374104-dee2a0ed3cd6", 500),
    ],
    photoCount: 35,
    mapImage: img("photo-1524661135-423995f22d0b", 1200),
  },
};

function buildGallery(base: Property): string[] {
  const pool = [
    base.image,
    img("photo-1600585154340-be6161a56a0c", 500),
    img("photo-1600607687939-ce8a6c25118c", 500),
    img("photo-1600047509358-9dc75507daeb", 500),
    img("photo-1605276374104-dee2a0ed3cd6", 500),
  ];
  return pool;
}

function buildReviews(property: Property) {
  return [
    {
      id: "r1",
      author: "Sarah Mitchell",
      avatar: img("photo-1494790108377-be9c29b29330", 80),
      date: "January 2026",
      rating: 5,
      comment: `Absolutely loved staying at ${property.title}. The space was immaculate and the host was very responsive.`,
    },
    {
      id: "r2",
      author: "James Chen",
      avatar: img("photo-1507003211169-0a1dd7228f2d", 80),
      date: "December 2025",
      rating: 5,
      comment: "Great location, beautiful interiors, and everything matched the listing photos perfectly.",
    },
    {
      id: "r3",
      author: "Emily Rodriguez",
      avatar: img("photo-1438761681033-6461ffad8d80", 80),
      date: "November 2025",
      rating: 4,
      comment: "Wonderful stay overall. Would definitely book again for our next trip.",
    },
  ];
}

export function getPropertyById(id: string): PropertyDetail | null {
  const base = MOCK_PROPERTIES.find((p) => p.id === id);
  if (!base) return null;

  const override = DETAIL_OVERRIDES[id] ?? {};

  return {
    ...base,
    region: override.region ?? `${base.city}, ${base.country}`,
    displayTitle: override.displayTitle ?? base.address,
    reviewCount: override.reviewCount ?? 28,
    images: override.images ?? buildGallery(base),
    photoCount: override.photoCount ?? 24,
    description: override.description ?? DEFAULT_DESCRIPTION,
    highlights: override.highlights ?? DEFAULT_HIGHLIGHTS,
    amenities: override.amenities ?? DEFAULT_AMENITIES,
    host: override.host ?? DEFAULT_HOST,
    policies: override.policies ?? [
      "Check-in after 3:00 PM",
      "Checkout before 11:00 AM",
      "No smoking indoors",
      "Pets allowed with prior approval",
      "Quiet hours from 10:00 PM to 8:00 AM",
    ],
    reviews: override.reviews ?? buildReviews(base),
    mapImage: override.mapImage ?? img("photo-1524661135-423995f22d0b", 1200),
  };
}

export const GUEST_OPTIONS = ["1 adult", "2 adults", "3 adults", "4 adults", "5+ adults"] as const;

export const DETAIL_TABS = [
  { id: "details" as const, label: "Property details" },
  { id: "policies" as const, label: "Policies" },
  { id: "reviews" as const, label: "Reviews" },
  { id: "messages" as const, label: "Messages", badge: 2 },
];
