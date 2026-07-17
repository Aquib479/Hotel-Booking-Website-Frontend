import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FormAlert } from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <Dialog open onOpenChange={() => onSkip?.()}>
      <DialogContent className="sm:max-w-md" showCloseButton={!!onSkip}>
        <DialogHeader>
          <DialogTitle>Verify your phone</DialogTitle>
          <DialogDescription>
            Enter the 6-digit code sent to {maskedPhone} via WhatsApp
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-2">
          {otp.digits.map((digit, i) => (
            <Input
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
              aria-invalid={!!displayError}
              className={cn("size-12 text-center text-lg font-semibold")}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {displayError && <FormAlert message={displayError} />}

        <DialogFooter className="flex-col gap-3 sm:flex-col">
          <Button
            type="button"
            variant="brand"
            className="w-full"
            onClick={() => void handleVerify()}
            disabled={otp.isVerifying || otp.code.length !== OTP_LENGTH}
          >
            {otp.isVerifying ? "Verifying…" : "Verify"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => void otp.resend()}
              disabled={otp.resendCooldownSeconds > 0}
            >
              {otp.resendCooldownSeconds > 0
                ? `Resend in ${otp.resendCooldownSeconds}s`
                : "Resend code"}
            </Button>

            {OTP_VERIFICATION_DEFERRABLE && onSkip && (
              <Button type="button" variant="ghost" className="h-auto p-0" onClick={onSkip}>
                Skip for now
              </Button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Demo code: <span className="font-mono">123456</span>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
