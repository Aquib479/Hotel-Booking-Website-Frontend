import { useEffect, useMemo, useState } from "react";

/** Recompute remaining seconds from an absolute expiry timestamp (same pattern as useSlotHold). */
export function useAbsoluteCountdown(expiresAt: string | undefined) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);

  return useMemo(() => {
    void tick;

    if (!expiresAt) {
      return { remainingSeconds: 0, isExpired: true };
    }

    const remainingMs = Math.max(0, new Date(expiresAt).getTime() - Date.now());
    const remainingSeconds = Math.ceil(remainingMs / 1000);

    return {
      remainingSeconds,
      isExpired: remainingMs <= 0,
    };
  }, [expiresAt, tick]);
}
