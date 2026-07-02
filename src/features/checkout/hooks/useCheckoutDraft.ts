import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { parseISO } from "date-fns";
import type { RestSlot } from "@/lib/booking/types";
import type { CurrencyCode } from "@/lib/currency/types";
import { CHECKOUT_DRAFT_KEY } from "../constants";
import type { CheckoutDraft } from "../types";
import {
  buildCheckoutDraft,
  isDraftHoldExpired,
  parseGuestsLabel,
} from "../utils";

function readDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

/** Fallback: migrate legacy URL-param checkout navigation into a draft */
function draftFromSearchParams(params: URLSearchParams, currency: CurrencyCode): CheckoutDraft | null {
  const propertyId = params.get("propertyId");
  if (!propertyId) return null;

  const mode = (params.get("mode") as CheckoutDraft["mode"]) ?? "stay";
  const lane = (params.get("lane") as CheckoutDraft["lane"]) ?? "direct";
  const guestsLabel = params.get("guests") ?? "2 adults";

  return buildCheckoutDraft({
    propertyId,
    lane,
    mode,
    currency,
    hotelTimezone: "UTC",
    guestsLabel,
    restDate: params.get("restDate") ? parseISO(params.get("restDate")!) : undefined,
    slot: (params.get("slot") as RestSlot) ?? undefined,
    checkIn: params.get("checkIn") ? parseISO(params.get("checkIn")!) : undefined,
    checkOut: params.get("checkOut") ? parseISO(params.get("checkOut")!) : undefined,
  });
}

export function useCheckoutDraft() {
  const [searchParams] = useSearchParams();
  const paramCurrency = (searchParams.get("currency") as CurrencyCode) ?? "USD";

  const [draft, setDraft] = useState<CheckoutDraft | null>(() => {
    const stored = readDraft();
    if (stored) return stored;
    return draftFromSearchParams(searchParams, paramCurrency);
  });

  useEffect(() => {
    if (draft) {
      sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(draft));
    }
  }, [draft]);

  const isExpired = useMemo(
    () => (draft ? isDraftHoldExpired(draft) : false),
    [draft]
  );

  const saveDraft = useCallback((next: CheckoutDraft) => {
    sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(next));
    setDraft(next);
  }, []);

  const clearDraft = useCallback(() => {
    sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
    setDraft(null);
  }, []);

  return { draft, isExpired, saveDraft, clearDraft, setDraft };
}

export { buildCheckoutDraft, parseGuestsLabel };
