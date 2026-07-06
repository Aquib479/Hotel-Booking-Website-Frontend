import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { OTP_LENGTH, OTP_VERIFICATION_DEFERRABLE } from "../constants";
import { useOtpVerification } from "../hooks/useOtpVerification";

interface OtpVerificationModalProps {
  phoneE164: string;
  onVerified: () => void;
  onSkip?: () => void;
  verify: (code: string) => Promise<boolean>;
}

export function OtpVerificationModal({
  phoneE164,
  onVerified,
  onSkip,
  verify: verifyWithAuth,
}: OtpVerificationModalProps) {
  const otp = useOtpVerification(phoneE164);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const displayError = verifyError ?? otp.error;

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      otp.setDigit(index, value);
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp.digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp.digits]
  );

  const handleVerify = useCallback(async () => {
    setVerifyError(null);
    const ok = await verifyWithAuth(otp.code);
    if (ok) onVerified();
    else {
      setVerifyError("Incorrect or expired code. Try again.");
      otp.reset();
    }
  }, [verifyWithAuth, otp, onVerified]);

  useEffect(() => {
    if (otp.code.length === OTP_LENGTH && !otp.isVerifying) {
      void handleVerify();
    }
  }, [otp.code, otp.isVerifying, handleVerify]);

  const maskedPhone = phoneE164.replace(/(\+\d{2,3})(\d+)(\d{4})/, "$1••••$3");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 id="otp-title" className="text-lg font-semibold text-foreground">
          Verify your phone
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the 6-digit code sent to {maskedPhone} via WhatsApp
        </p>

        <div className="mt-6 flex justify-center gap-2">
          {otp.digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                "size-12 rounded-xl border border-border text-center text-lg font-semibold outline-none focus:border-brand focus:ring-2 focus:ring-brand/20",
                displayError && "border-red-400"
              )}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {displayError && (
          <p className="mt-3 text-center text-sm text-red-600" role="alert">
            {displayError}
          </p>
        )}

        <button
          type="button"
          onClick={() => void handleVerify()}
          disabled={otp.isVerifying || otp.code.length !== OTP_LENGTH}
          className="mt-6 w-full rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {otp.isVerifying ? "Verifying…" : "Verify"}
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => void otp.resend()}
            disabled={otp.resendCooldownSeconds > 0}
            className="font-medium text-brand disabled:text-muted-foreground"
          >
            {otp.resendCooldownSeconds > 0
              ? `Resend in ${otp.resendCooldownSeconds}s`
              : "Resend code"}
          </button>

          {OTP_VERIFICATION_DEFERRABLE && onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip for now
            </button>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Demo code: <span className="font-mono">123456</span>
        </p>
      </div>
    </div>
  );
}
