export { useSearchStore, formatDateForApi, toSearchDestination } from "./searchStore";
export type { SearchCriteria, SearchDestination, SearchHotelResult } from "./searchStore";

export { useHotelStore } from "./hotelStore";
export type { SelectedRateOption } from "./hotelStore";

export { useBookingStore } from "./bookingStore";

export { useFavoritesStore } from "./favoritesStore";

/** @deprecated stub kept for older imports */
export const useStore = () => ({
  user: null,
  theme: "light" as const,
});
