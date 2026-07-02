import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router-dom";
import type { BookingLane, SlotDuration } from "@/lib/booking/types";
import { formatPrice, type WholesaleQuote } from "@/lib/currency/format";
import { getDisplayAmount, getPriceUnit } from "@/lib/currency/pricing";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";

const STORAGE_KEY = "resthalf-currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencies: typeof CURRENCIES;
  format: (amount: number, currencyOverride?: CurrencyCode) => string;
  formatLanePrice: (
    lane: BookingLane,
    priceUsd: number,
    priceIdr: number,
    mode?: "rest" | "stay",
    wholesalePricing?: WholesaleQuote,
    slotDuration?: SlotDuration
  ) => { amount: string; unit: string };
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function readStoredCurrency(): CurrencyCode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (stored && CURRENCIES.some((c) => c.code === stored)) return stored;
  } catch {
    /* ignore */
  }
  return "USD";
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramCurrency = searchParams.get("currency") as CurrencyCode | null;

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (paramCurrency && CURRENCIES.some((c) => c.code === paramCurrency)) {
      return paramCurrency;
    }
    return readStoredCurrency();
  });

  const setCurrency = useCallback(
    (code: CurrencyCode) => {
      setCurrencyState(code);
      localStorage.setItem(STORAGE_KEY, code);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("currency", code);
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  useEffect(() => {
    if (paramCurrency && CURRENCIES.some((c) => c.code === paramCurrency)) {
      setCurrencyState(paramCurrency);
    }
  }, [paramCurrency]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      setCurrency,
      currencies: CURRENCIES,
      format: (amount, currencyOverride) =>
        formatPrice(amount, currencyOverride ?? currency),
      formatLanePrice: (
        lane,
        priceUsd,
        priceIdr,
        mode = "stay",
        wholesalePricing,
        slotDuration = "12h"
      ) => {
        const display = getDisplayAmount(
          lane,
          priceUsd,
          priceIdr,
          currency,
          wholesalePricing
        );
        return {
          amount: formatPrice(display, currency),
          unit: getPriceUnit(lane, mode, slotDuration),
        };
      },
    }),
    [currency, setCurrency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { convertFromUsd, convertFromIdr } from "@/lib/currency/format";
