import { useEffect, useMemo, useState } from "react";

export interface SlotHoldState {
  remainingSeconds: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  isWarning: boolean;
  isCritical: boolean;
}

export function useSlotHold(holdExpiresAt: string | undefined): SlotHoldState {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!holdExpiresAt) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [holdExpiresAt]);

  return useMemo(() => {
    void tick;

    if (!holdExpiresAt) {
      return {
        remainingSeconds: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        isWarning: false,
        isCritical: false,
      };
    }

    const remainingMs = Math.max(0, new Date(holdExpiresAt).getTime() - Date.now());
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const isExpired = remainingMs <= 0;

    return {
      remainingSeconds,
      minutes,
      seconds,
      isExpired,
      isWarning: !isExpired && remainingSeconds <= 300 && remainingSeconds > 60,
      isCritical: !isExpired && remainingSeconds <= 60,
    };
  }, [holdExpiresAt, tick]);
}
