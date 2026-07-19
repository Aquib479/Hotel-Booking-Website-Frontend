import { differenceInDays, parseISO } from "date-fns";
import { CHECKOUT_DRAFT_KEY } from "./constants";
import type { BookingLane, BookingMode, RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";
import { SLOT_HOLD_MINUTES } from "./constants";
import type { CheckoutDraft, CheckoutGuests } from "./types";

export function parseGuestsLabel(label: string): CheckoutGuests {
  const adultsMatch = label.match(/(\d+)\s*adult/i);
  const childrenMatch = label.match(/(\d+)\s*kid/i);
  return {
    adults: adultsMatch ? Number(adultsMatch[1]) : 1,
    children: childrenMatch ? Number(childrenMatch[1]) : 0,
  };
}

export function formatGuestsSummary(guests: CheckoutGuests): string {
  const parts = [`${guests.adults} adult${guests.adults !== 1 ? "s" : ""}`];
  if (guests.children > 0) {
    parts.push(`${guests.children} child${guests.children !== 1 ? "ren" : ""}`);
  }
  return parts.join(", ");
}

interface BuildDraftInput {
  propertyId: string;
  lane: BookingLane;
  mode: BookingMode;
  currency: CurrencyCode;
  hotelTimezone: string;
  guestsLabel: string;
  restDate?: Date;
  slot?: RestSlot;
  checkIn?: Date;
  checkOut?: Date;
}

export function buildCheckoutDraft(input: BuildDraftInput): CheckoutDraft {
  const guests = parseGuestsLabel(input.guestsLabel);
  const now = new Date();

  const draft: CheckoutDraft = {
    propertyId: input.propertyId,
    lane: input.lane,
    mode: input.mode,
    guests,
    guestsLabel: input.guestsLabel,
    currency: input.currency,
    hotelTimezone: input.hotelTimezone,
    createdAt: now.toISOString(),
  };

  if (input.mode === "rest" && input.restDate) {
    draft.slotDate = input.restDate.toISOString();
    draft.slotWindow = input.slot ?? "12-24";
  } else if (input.checkIn && input.checkOut) {
    draft.checkIn = input.checkIn.toISOString();
    draft.checkOut = input.checkOut.toISOString();
    draft.nights = Math.max(1, differenceInDays(input.checkOut, input.checkIn));
  }

  if (input.lane === "direct") {
    const holdExpires = new Date(now.getTime() + SLOT_HOLD_MINUTES * 60 * 1000);
    draft.holdExpiresAt = holdExpires.toISOString();
    draft.holdId = `hold-${input.propertyId}-${now.getTime()}`;
  }

  return draft;
}

export function readCheckoutDraftFromStorage(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

export function saveCheckoutDraftToStorage(draft: CheckoutDraft): void {
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
}

export function clearCheckoutDraftFromStorage(): void {
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

export function isDraftHoldExpired(draft: CheckoutDraft): boolean {
  if (draft.lane !== "direct" || !draft.holdExpiresAt) return false;
  return new Date(draft.holdExpiresAt).getTime() <= Date.now();
}

export function draftToDetailSearchParams(draft: CheckoutDraft): URLSearchParams {
  const params = new URLSearchParams({
    mode: draft.mode,
    guests: draft.guestsLabel,
  });
  if (draft.mode === "rest") {
    if (draft.slotDate) params.set("restDate", draft.slotDate);
    if (draft.slotWindow) params.set("slot", draft.slotWindow);
  } else {
    if (draft.checkIn) params.set("checkIn", draft.checkIn);
    if (draft.checkOut) params.set("checkOut", draft.checkOut);
  }
  if (draft.currency) params.set("currency", draft.currency);
  return params;
}

export function parseDraftDates(draft: CheckoutDraft) {
  return {
    restDate: draft.slotDate ? parseISO(draft.slotDate) : undefined,
    checkIn: draft.checkIn ? parseISO(draft.checkIn) : undefined,
    checkOut: draft.checkOut ? parseISO(draft.checkOut) : undefined,
  };
}
