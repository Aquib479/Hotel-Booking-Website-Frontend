import { create } from "zustand";
import {
  book,
  bookInit,
  cancelBooking,
  getCancellationFee,
  pollBookingDetails,
  priceRecommendation,
  ZentrumApiError,
  type BookRequest,
  type BookResponse,
  type BookingDetailsResponse,
  type PriceResponse,
} from "@/services/zentrumhub";
import { useHotelStore } from "./hotelStore";
import { useSearchStore } from "./searchStore";

interface BookingStoreState {
  price: PriceResponse | null;
  hold: BookResponse | null;
  confirmation: BookResponse | null;
  details: BookingDetailsResponse | null;
  cancellationFee: unknown | null;
  status:
    | "idle"
    | "pricing"
    | "priced"
    | "holding"
    | "booking"
    | "confirming"
    | "confirmed"
    | "cancelling"
    | "cancelled"
    | "error";
  error: string | null;

  runPricing: () => Promise<PriceResponse | null>;
  runBookInit: (request: BookRequest) => Promise<BookResponse | null>;
  runBook: (request: BookRequest) => Promise<BookResponse | null>;
  recoverBooking: (bookingId: string) => Promise<BookingDetailsResponse | null>;
  loadCancellationFee: (bookingId: string) => Promise<unknown>;
  runCancel: (bookingId: string) => Promise<void>;
  reset: () => void;
}

function sessionContext() {
  const { token, correlationId } = useSearchStore.getState();
  const { hotelId, selected } = useHotelStore.getState();
  return { token, correlationId, hotelId, selected };
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  price: null,
  hold: null,
  confirmation: null,
  details: null,
  cancellationFee: null,
  status: "idle",
  error: null,

  runPricing: async () => {
    const { token, correlationId, hotelId, selected } = sessionContext();
    if (!token || !correlationId || !hotelId || !selected) {
      set({
        status: "error",
        error: "Missing search token, hotel, or selected recommendation for pricing",
      });
      return null;
    }

    set({ status: "pricing", error: null });
    try {
      const { data } = await priceRecommendation(
        hotelId,
        token,
        selected.recommendationId,
        { correlationId }
      );
      set({ price: data, status: "priced" });
      return data;
    } catch (err) {
      const message =
        err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Pricing failed";
      set({ status: "error", error: message });
      return null;
    }
  },

  runBookInit: async (request) => {
    const { token, correlationId, hotelId, selected } = sessionContext();
    if (!token || !correlationId || !hotelId || !selected) {
      set({ status: "error", error: "Missing session context for BookInit" });
      return null;
    }

    set({ status: "holding", error: null });
    try {
      const totalRate =
        get().price?.totalRate ?? selected.totalRate ?? request.totalRate ?? 0;

      const { data } = await bookInit(
        hotelId,
        token,
        {
          ...request,
          rateIds: request.rateIds ?? selected.rateIds,
          totalRate,
        },
        { correlationId }
      );
      set({ hold: data, status: "priced" });
      return data;
    } catch (err) {
      const message =
        err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "BookInit failed";
      set({ status: "error", error: message });
      return null;
    }
  },

  runBook: async (request) => {
    const { token, correlationId, hotelId, selected } = sessionContext();
    if (!token || !correlationId || !hotelId || !selected) {
      set({ status: "error", error: "Missing session context for Book" });
      return null;
    }

    set({ status: "booking", error: null });
    try {
      const totalRate =
        get().price?.totalRate ?? selected.totalRate ?? request.totalRate ?? 0;

      const { data } = await book(
        hotelId,
        token,
        {
          ...request,
          rateIds: request.rateIds ?? selected.rateIds,
          totalRate,
        },
        { correlationId }
      );

      set({ confirmation: data, status: "confirming" });

      if (data.bookingId) {
        const details = await pollBookingDetails(data.bookingId, { correlationId });
        set({ details, status: "confirmed" });
      } else {
        set({ status: "confirmed" });
      }

      return data;
    } catch (err) {
      const holdId = get().hold?.bookingId;
      if (holdId) {
        try {
          const { correlationId: cid } = useSearchStore.getState();
          if (cid) {
            const details = await pollBookingDetails(holdId, { correlationId: cid });
            set({ details, confirmation: get().hold, status: "confirmed", error: null });
            return get().hold;
          }
        } catch {
          /* fall through */
        }
      }

      const message =
        err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Booking failed";
      set({ status: "error", error: message });
      return null;
    }
  },

  recoverBooking: async (bookingId) => {
    const { correlationId } = useSearchStore.getState();
    if (!correlationId) {
      set({ status: "error", error: "Missing correlationId for recovery" });
      return null;
    }
    set({ status: "confirming", error: null });
    try {
      const details = await pollBookingDetails(bookingId, { correlationId });
      set({ details, status: "confirmed" });
      return details;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not recover booking details";
      set({ status: "error", error: message });
      return null;
    }
  },

  loadCancellationFee: async (bookingId) => {
    const { correlationId } = useSearchStore.getState();
    if (!correlationId) throw new Error("Missing correlationId");
    const { data } = await getCancellationFee(bookingId, { correlationId });
    set({ cancellationFee: data });
    return data;
  },

  runCancel: async (bookingId) => {
    const { correlationId } = useSearchStore.getState();
    if (!correlationId) {
      set({ status: "error", error: "Missing correlationId for cancel" });
      return;
    }
    set({ status: "cancelling", error: null });
    try {
      await cancelBooking(bookingId, { correlationId });
      set({ status: "cancelled" });
    } catch (err) {
      const message =
        err instanceof ZentrumApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Cancel failed";
      set({ status: "error", error: message });
    }
  },

  reset: () =>
    set({
      price: null,
      hold: null,
      confirmation: null,
      details: null,
      cancellationFee: null,
      status: "idle",
      error: null,
    }),
}));
