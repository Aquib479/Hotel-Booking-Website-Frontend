export const FEATURE_BADGES = [
  "landing.badge1",
  "landing.badge2",
  "landing.badge3",
] as const;

export const REVIEW_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
] as const;

export { GUEST_OPTIONS } from "@/components/common/search";

export interface PopularDestination {
  city: string;
  country: string;
  image: string;
}

export const POPULAR_DESTINATIONS: PopularDestination[] = [
  { city: "Jakarta", country: "Indonesia", image: "/destinations/jakarta.png" },
  { city: "Kuala Lumpur", country: "Malaysia", image: "/destinations/kuala-lumpur.png" },
  { city: "Singapore", country: "Singapore", image: "/destinations/singapore.png" },
  { city: "Bangkok", country: "Thailand", image: "/destinations/bangkok.png" },
  { city: "Ho Chi Minh City", country: "Vietnam", image: "/destinations/ho-chi-minh.png" },
  { city: "Phnom Penh", country: "Cambodia", image: "/destinations/phnom-penh.png" },
  { city: "Hyderabad", country: "India", image: "/destinations/hyderabad.png" },
  { city: "Tokyo", country: "Japan", image: "/destinations/tokyo.png" },
  { city: "Manila", country: "Philippines", image: "/destinations/manila.png" },
];
