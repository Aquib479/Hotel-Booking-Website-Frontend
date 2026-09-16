export const DEFAULT_PRICE_MIN = 0;
/** USD reference used to derive per-currency budget defaults / preset pills. */
export const DEFAULT_PRICE_MAX_USD = 1000;
/** @deprecated Use DEFAULT_PRICE_MAX_USD — kept as alias for older imports */
export const DEFAULT_PRICE_MAX = DEFAULT_PRICE_MAX_USD;
export const DEFAULT_PER_PAGE = 20;
/** Cards loaded per infinite-scroll batch. */
export const INFINITE_SCROLL_PAGE_SIZE = 12;

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

export const STAR_CHECKBOX_OPTIONS = [5, 4, 3, 2] as const;

export const GUEST_RATING_OPTIONS = [
  { value: 9, label: "Great 9+", hint: "Based on guest reviews" },
  { value: 8, label: "Very Good 8+" },
  { value: 7, label: "Good 7+" },
] as const;

/** USD bounds for budget preset pills (converted for display). */
export const BUDGET_PRESETS_USD = [
  { min: 0, max: 50 },
  { min: 50, max: 100 },
  { min: 100, max: 150 },
  { min: 150, max: 250 },
  { min: 250, max: 500 },
  { min: 500, max: 1000 },
] as const;

export const POPULAR_AMENITY_FILTERS = [
  "Breakfast",
  "Free cancellation",
  "Pool",
  "Kitchen",
  "Free Parking",
  "WiFi",
] as const;

export const PROPERTY_FACILITY_FILTERS = [
  "Pool",
  "Free Parking",
  "Airport shuttle",
  "Gym",
  "WiFi",
  "Air conditioning",
] as const;

export const ROOM_FACILITY_FILTERS = [
  "Kitchen",
  "Breakfast",
  "1+ bathroom",
  "Air conditioning",
] as const;

export const AIRPORT_DISTANCE_OPTIONS = [
  { value: "any" as const, label: "Any distance" },
  { value: 5 as const, label: "Within 5 km" },
  { value: 15 as const, label: "Within 15 km" },
  { value: 30 as const, label: "Within 30 km" },
];
