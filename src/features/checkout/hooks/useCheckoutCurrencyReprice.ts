import { useEffect, useRef, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import {
  buildDisplayRoomGroups,
  type DisplayRateOption,
  type DisplayRoomGroup,
} from "@/features/property/utils/roomsRatesDisplay";
import { useHotelStore, useSearchStore } from "@/store";
import type { CheckoutDraft } from "../types";

function toCurrencyCode(code: string | undefined): CurrencyCode {
  const upper = (code || "USD").toUpperCase();
  return CURRENCIES.some((c) => c.code === upper) ? (upper as CurrencyCode) : "USD";
}

function normalize(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase();
}

/**
 * Prefer the same room / board / refundability after a currency reprice.
 * Falls back to same room cheapest, then overall cheapest.
 */
export function rematchCheckoutRate(
  groups: DisplayRoomGroup[],
  draft: CheckoutDraft
): { group: DisplayRoomGroup; option: DisplayRateOption } | null {
  const options = groups.flatMap((group) =>
    group.options.map((option) => ({ group, option }))
  );
  if (!options.length) return null;

  const roomName = normalize(draft.roomName);
  const board = normalize(draft.boardBasis);
  const refundable = draft.refundable;

  const scored = options
    .map((entry) => {
      let score = 0;
      if (roomName && normalize(entry.group.roomName) === roomName) score += 8;
      if (
        roomName &&
        normalize(entry.group.roomTypeLabel) === normalize(draft.roomTypeLabel)
      ) {
        score += 2;
      }
      if (board && normalize(entry.option.boardBasisLabel) === board) score += 4;
      if (
        refundable != null &&
        entry.option.refundable === refundable
      ) {
        score += 2;
      }
      if (
        draft.recommendationId &&
        entry.option.recommendationId === draft.recommendationId
      ) {
        score += 1;
      }
      return { ...entry, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.option.totalRate - b.option.totalRate;
    });

  const best = scored[0];
  if (!best) return null;
  // Require at least a room-name match when we know the room; otherwise cheapest.
  if (roomName && best.score < 8) {
    const cheapest = [...options].sort(
      (a, b) => a.option.totalRate - b.option.totalRate
    )[0];
    return cheapest ?? null;
  }
  return { group: best.group, option: best.option };
}

/**
 * When navbar currency changes on checkout, re-init ZH availability in that
 * currency and refresh the draft totals from live rooms/rates (no client FX).
 */
export function useCheckoutCurrencyReprice(
  draft: CheckoutDraft | null,
  saveDraft: (next: CheckoutDraft) => void
): { isRefreshingPrice: boolean; priceRefreshError: string | null } {
  const { currency } = useCurrency();
  const { t } = useLanguage();
  const [isRefreshingPrice, setIsRefreshingPrice] = useState(false);
  const [priceRefreshError, setPriceRefreshError] = useState<string | null>(null);
  const requestIdRef = useRef(0);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    const current = draftRef.current;
    if (!current || current.source !== "zentrumhub") return;
    if (toCurrencyCode(current.currency) === currency) return;
    if (!current.propertyId || !current.checkIn || !current.checkOut) return;

    const snapshot = current;
    const requestId = ++requestIdRef.current;
    let cancelled = false;

    async function refresh() {
      setIsRefreshingPrice(true);
      setPriceRefreshError(null);

      try {
        await useSearchStore.getState().repriceHotel(snapshot.propertyId, currency, {
          checkIn: snapshot.checkIn,
          checkOut: snapshot.checkOut,
        });
        if (cancelled || requestId !== requestIdRef.current) return;

        const search = useSearchStore.getState();
        if (search.status === "error") {
          setPriceRefreshError(search.error ?? t("checkout.refreshFail"));
          return;
        }

        await useHotelStore
          .getState()
          .loadRoomsAndRates(snapshot.propertyId, { currency });
        if (cancelled || requestId !== requestIdRef.current) return;

        const hotel = useHotelStore.getState();
        if (hotel.status === "error") {
          setPriceRefreshError(hotel.error ?? t("checkout.loadRatesFail"));
          return;
        }

        const groups = buildDisplayRoomGroups(hotel.roomsRates);
        const match = rematchCheckoutRate(groups, snapshot);
        if (!match) {
          setPriceRefreshError(t("checkout.roomUnavailable"));
          return;
        }

        const selected = useHotelStore
          .getState()
          .selectRecommendation(match.option.recommendationId);
        if (!selected) {
          setPriceRefreshError(t("checkout.rateSelectFail"));
          return;
        }

        const latest = draftRef.current ?? snapshot;
        saveDraft({
          ...latest,
          currency: toCurrencyCode(selected.currency || currency),
          totalPrice: selected.totalRate,
          recommendationId: selected.recommendationId,
          rateIds: selected.rateIds,
          roomId: selected.roomId,
          roomName: selected.roomName,
          roomTypeLabel: selected.roomTypeLabel,
          boardBasis: selected.boardBasis,
          refundable: selected.refundable,
          cancellationText: selected.cancellationText,
          bedSummary: selected.bedSummary,
          maxGuests: selected.maxGuests,
          roomFacilities: selected.facilities,
          roomImageUrl: selected.imageUrl,
        });
      } catch (err) {
        if (cancelled || requestId !== requestIdRef.current) return;
        setPriceRefreshError(
          err instanceof Error ? err.message : t("checkout.refreshFail")
        );
      } finally {
        if (!cancelled && requestId === requestIdRef.current) {
          setIsRefreshingPrice(false);
        }
      }
    }

    void refresh();
    return () => {
      cancelled = true;
    };
  }, [
    currency,
    draft?.source,
    draft?.currency,
    draft?.propertyId,
    draft?.checkIn,
    draft?.checkOut,
    saveDraft,
    t,
  ]);

  return { isRefreshingPrice, priceRefreshError };
}
