import { useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CHECKOUT_DRAFT_KEY } from "@/features/checkout/constants";
import type { CheckoutDraft } from "@/features/checkout/types";
import { isDraftHoldExpired } from "@/features/checkout/utils";
import { AUTH_REDIRECT_PARAM } from "../constants";

function readDraft(): CheckoutDraft | null {
  try {
    const raw = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutDraft;
  } catch {
    return null;
  }
}

export function useAuthRedirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get(AUTH_REDIRECT_PARAM);

  const redirectAfterAuth = useCallback(() => {
    const target = redirectTarget || "/";

    if (target.startsWith("/checkout")) {
      const draft = readDraft();
      if (!draft) {
        navigate("/checkout", { replace: true });
        return;
      }
      if (isDraftHoldExpired(draft)) {
        navigate("/checkout?expired=1", { replace: true });
        return;
      }
      navigate("/checkout", { replace: true });
      return;
    }

    navigate(target, { replace: true });
  }, [navigate, redirectTarget]);

  const buildAuthPath = useCallback(
    (path: "/login" | "/signup" | "/forgot-password", extraParams?: Record<string, string>) => {
      const next = new URLSearchParams(searchParams);
      if (extraParams) {
        Object.entries(extraParams).forEach(([k, v]) => next.set(k, v));
      }
      const qs = next.toString();
      return qs ? `${path}?${qs}` : path;
    },
    [searchParams]
  );

  const redirectParam = useMemo(() => redirectTarget, [redirectTarget]);

  return { redirectAfterAuth, buildAuthPath, redirectParam };
}
