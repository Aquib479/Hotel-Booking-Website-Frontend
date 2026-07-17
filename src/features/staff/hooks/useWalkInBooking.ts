import { useCallback, useState } from "react";
import { submitWalkInBooking } from "../api";
import { useStaffAuth } from "./useStaffAuth";
import type {
  WalkInBookingDraft,
  WalkInBookingResult,
  WalkInGuestDetails,
  WalkInPaymentMethod,
  WalkInRoom,
} from "../types";
import type { RestSlot } from "@/lib/booking/types";

const EMPTY_GUEST: WalkInGuestDetails = {
  fullName: "",
  phoneCountryCode: "+91",
  phoneNational: "",
  email: "",
  idDocument: "",
};

export function useWalkInBooking() {
  const { staff } = useStaffAuth();
  const [draft, setDraft] = useState<WalkInBookingDraft>({
    room: null,
    slot: null,
    guest: EMPTY_GUEST,
    paymentMethod: "cash",
    cashConfirmed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<WalkInBookingResult | null>(null);

  const selectRoom = useCallback((room: WalkInRoom | null) => {
    setDraft((d) => ({
      ...d,
      room,
      slot: room && d.slot && room.availableSlots.includes(d.slot) ? d.slot : room?.availableSlots[0] ?? null,
    }));
    setError(null);
    setLastResult(null);
  }, []);

  const selectSlot = useCallback((slot: RestSlot) => {
    setDraft((d) => ({ ...d, slot }));
    setError(null);
  }, []);

  const updateGuest = useCallback((patch: Partial<WalkInGuestDetails>) => {
    setDraft((d) => ({ ...d, guest: { ...d.guest, ...patch } }));
    setError(null);
  }, []);

  const setPaymentMethod = useCallback((paymentMethod: WalkInPaymentMethod) => {
    setDraft((d) => ({
      ...d,
      paymentMethod,
      cashConfirmed: paymentMethod === "cash" ? d.cashConfirmed : true,
    }));
    setError(null);
  }, []);

  const setCashConfirmed = useCallback((cashConfirmed: boolean) => {
    setDraft((d) => ({ ...d, cashConfirmed }));
  }, []);

  const reset = useCallback(() => {
    setDraft({
      room: null,
      slot: null,
      guest: EMPTY_GUEST,
      paymentMethod: "cash",
      cashConfirmed: false,
    });
    setError(null);
    setLastResult(null);
  }, []);

  const canSubmit =
    !!draft.room &&
    !!draft.slot &&
    draft.guest.fullName.trim().length >= 2 &&
    draft.guest.phoneNational.trim().length >= 8 &&
    (draft.paymentMethod !== "cash" || draft.cashConfirmed);

  const submit = useCallback(async () => {
    if (!staff || !draft.room || !draft.slot || !canSubmit) return null;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitWalkInBooking({
        staff,
        room: draft.room,
        slot: draft.slot,
        guest: draft.guest,
        paymentMethod: draft.paymentMethod,
      });
      setLastResult(result);
      return result;
    } catch {
      setError("Booking failed. Please try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [staff, draft, canSubmit]);

  const commissionPreview =
    draft.room && staff
      ? Math.round(draft.room.rateAmount * 0.08)
      : null;

  return {
    draft,
    selectRoom,
    selectSlot,
    updateGuest,
    setPaymentMethod,
    setCashConfirmed,
    submit,
    reset,
    canSubmit,
    isSubmitting,
    error,
    lastResult,
    commissionPreview,
    commissionCurrency: draft.room?.rateCurrency ?? staff?.property.localCurrency,
  };
}
