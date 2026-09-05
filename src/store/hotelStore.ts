import { create } from "zustand";
import {
  getRoomsAndRates,
  ZentrumApiError,
  type RoomsAndRatesResponse,
} from "@/services/zentrumhub";
import { useSearchStore } from "./searchStore";
import {
  buildDisplayRoomGroups,
  findDisplayOption,
} from "@/features/property/utils/roomsRatesDisplay";

export interface SelectedRateOption {
  recommendationId: string;
  rateIds: string[];
  roomId: string;
  totalRate: number;
  baseRate?: number;
  publishedRate?: number;
  taxesAmount?: number;
  currency: string;
  roomName: string;
  roomTypeLabel?: string;
  boardBasis?: string | null;
  refundable?: boolean | null;
  cancellationText?: string | null;
  imageUrl?: string;
  maxGuests?: number;
  bedSummary?: string;
  facilities?: string[];
  includes?: string[];
  views?: string[];
  areaLabel?: string;
}

interface HotelStoreState {
  hotelId: string | null;
  roomsRates: RoomsAndRatesResponse | null;
  selected: SelectedRateOption | null;
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;

  loadRoomsAndRates: (hotelId: string, options?: { currency?: string }) => Promise<void>;
  selectRecommendation: (recommendationId: string) => SelectedRateOption | null;
  clearSelection: () => void;
  reset: () => void;
}

export const useHotelStore = create<HotelStoreState>((set, get) => ({
  hotelId: null,
  roomsRates: null,
  selected: null,
  status: "idle",
  error: null,

  loadRoomsAndRates: async (hotelId, options) => {
    const searchState = useSearchStore.getState();
    const { token, correlationId, currency: sessionCurrency } = searchState;
    if (!token || !correlationId) {
      set({
        status: "error",
        error: "hotel.noSearchToken",
        hotelId,
      });
      return;
    }

    const currency = options?.currency || sessionCurrency;

    set({ hotelId, status: "loading", error: null, selected: null, roomsRates: null });

    try {
      const { data } = await getRoomsAndRates(hotelId, token, {
        correlationId,
        body: currency ? { currency } : {},
      });
      set({ roomsRates: data, status: "ready" });
    } catch (err) {
      const message =
        err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "hotel.loadRoomsFail";
      set({ status: "error", error: message });
    }
  },

  selectRecommendation: (recommendationId) => {
    const roomsRates = get().roomsRates;
    const groups = buildDisplayRoomGroups(roomsRates);
    const match = findDisplayOption(groups, recommendationId);
    if (!match) return null;

    const selected: SelectedRateOption = {
      recommendationId: match.option.recommendationId,
      rateIds: match.option.rateIds,
      roomId: match.option.roomId,
      totalRate: match.option.totalRate,
      baseRate: match.option.baseRate,
      publishedRate: match.option.publishedRate,
      taxesAmount: match.option.taxesAmount,
      currency: match.option.currency,
      roomName: match.group.roomName,
      roomTypeLabel: match.group.roomTypeLabel,
      boardBasis: match.option.boardBasisLabel,
      refundable: match.option.refundable,
      cancellationText: match.option.cancellationText,
      imageUrl: match.group.imageUrl,
      maxGuests: match.group.maxGuests,
      bedSummary: match.group.bedSummary,
      facilities: match.group.facilities,
      includes: match.option.includes,
      views: match.group.views,
      areaLabel: match.group.areaLabel,
    };
    set({ selected });
    return selected;
  },

  clearSelection: () => set({ selected: null }),

  reset: () =>
    set({
      hotelId: null,
      roomsRates: null,
      selected: null,
      status: "idle",
      error: null,
    }),
}));
