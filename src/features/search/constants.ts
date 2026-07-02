export { MOCK_PROPERTIES } from "./mock-properties";

export const DEFAULT_PRICE_MIN = 0;
export const DEFAULT_PRICE_MAX = 500;
export const DEFAULT_PER_PAGE = 9;

export { GUEST_OPTIONS } from "@/components/common/search";

export const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "soonest-slot", label: "Soonest available slot" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export const CATEGORIES = [
  { id: "all", label: "All", icon: "layout-grid" },
  { id: "near-airport", label: "Near Airport", icon: "plane" },
  { id: "city-center", label: "City Center", icon: "building-2" },
  { id: "business", label: "Business Hotels", icon: "briefcase" },
  { id: "layover-friendly", label: "Layover Friendly", icon: "clock" },
  { id: "resthalf-exclusive", label: "RestHalf Exclusive", icon: "badge-check" },
] as const;

export { ROOM_TYPE_OPTIONS, AMENITY_FILTER_OPTIONS, SLOT_DURATION_OPTIONS } from "@/lib/booking/types";

export const COUNT_OPTIONS = ["any", "1", "2", "3", "4", "5+"] as const;

export const STAR_RATING_OPTIONS = ["any", "3", "4", "5"] as const;

export const AIRPORT_DISTANCE_OPTIONS = [
  { value: "any" as const, label: "Any distance" },
  { value: 5 as const, label: "Within 5 km" },
  { value: 15 as const, label: "Within 15 km" },
  { value: 30 as const, label: "Within 30 km" },
];
