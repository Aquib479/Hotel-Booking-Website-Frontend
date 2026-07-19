export type BookingLane = "direct" | "wholesale";
export type BookingMode = "rest" | "stay";
export type RestSlot = "00-12" | "12-24" | "24h";
export type RoomType = "single" | "double" | "suite" | "family";
export type SlotDuration = "12h" | "24h";

export const REST_SLOTS: { value: RestSlot; label: string }[] = [
  { value: "00-12", label: "00:00 – 12:00" },
  { value: "12-24", label: "12:00 – 24:00" },
  { value: "24h", label: "Full 24 hours" },
];

export const SLOT_DURATION_OPTIONS: SlotDuration[] = ["12h", "24h"];

export const ROOM_TYPE_OPTIONS: { value: RoomType | "any"; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "single", label: "Single" },
  { value: "double", label: "Double" },
  { value: "suite", label: "Suite" },
  { value: "family", label: "Family" },
];

export const AMENITY_FILTER_OPTIONS = [
  "WiFi",
  "Air conditioning",
  "Free Parking",
  "Free cancellation",
  "1+ bathroom",
  "Pool",
  "Airport shuttle",
  "Breakfast",
  "Gym",
] as const;

export type AmenityFilter = (typeof AMENITY_FILTER_OPTIONS)[number];
