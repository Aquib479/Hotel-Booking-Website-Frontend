import { useCallback, useEffect, useMemo, useState } from "react";
import { useAbsoluteCountdown } from "@/lib/hooks/useAbsoluteCountdown";
import { OTP_LENGTH, OTP_RESEND_COOLDOWN_SECONDS } from "../constants";
import { sendOtp, verifyOtp as apiVerifyOtp } from "../api";

export function useOtpVerification(phoneE164: string) {
  const [digits, setDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownExpiresAt, setCooldownExpiresAt] = useState<string | undefined>();

  const { remainingSeconds, isExpired: cooldownComplete } = useAbsoluteCountdown(cooldownExpiresAt);
  const resendCooldownSeconds = cooldownComplete ? 0 : remainingSeconds;

  const startCooldown = useCallback(() => {
    setCooldownExpiresAt(new Date(Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000).toISOString());
  }, []);

  useEffect(() => {
    if (!phoneE164) return;
    void sendOtp(phoneE164).then(({ expiresAt }) => setCooldownExpiresAt(expiresAt));
  }, [phoneE164]);

  const setDigit = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    setError(null);
  }, []);

  const code = useMemo(() => digits.join(""), [digits]);

  const verify = useCallback(
    async (overrideCode?: string) => {
      const attempt = overrideCode ?? code;
      if (attempt.length !== OTP_LENGTH) {
        setError("Enter the full 6-digit code");
        return false;
      }
      setIsVerifying(true);
      setError(null);
      try {
        const ok = await apiVerifyOtp(phoneE164, attempt);
        if (!ok) {
          setError("Incorrect or expired code. Try again.");
          return false;
        }
        return true;
      } finally {
        setIsVerifying(false);
      }
    },
    [code, phoneE164]
  );

  const resend = useCallback(async () => {
    if (resendCooldownSeconds > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
    const { expiresAt } = await sendOtp(phoneE164);
    setCooldownExpiresAt(expiresAt);
    startCooldown();
  }, [phoneE164, resendCooldownSeconds, startCooldown]);

  const reset = useCallback(() => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(null);
  }, []);

  return {
    digits,
    setDigit,
    code,
    isVerifying,
    error,
    resendCooldownSeconds,
    resend,
    verify,
    reset,
  };
}
