import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { OtpVerificationModal } from "@/features/auth/components/OtpVerificationModal";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { toE164 } from "@/lib/phone/validation";
import { cn } from "@/lib/utils";
import type { UserProfile } from "../types";
import type { PhoneVerificationStatus } from "../types";

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return phone;
  const country = phone.startsWith("+") ? phone.slice(0, 3) : "";
  return `${country} ${digits.slice(3, 4)}•• •••• ${digits.slice(-4)}`.trim();
}

function getPhoneStatus(profile: UserProfile): PhoneVerificationStatus {
  if (profile.pendingPhoneE164) return "pending";
  if (profile.phoneVerified) return "verified";
  return "unverified";
}

const STATUS_LABELS: Record<PhoneVerificationStatus, string> = {
  verified: "Verified",
  pending: "Verification pending",
  unverified: "Not verified",
};

interface PhoneNumberSectionProps {
  profile: UserProfile;
  onStartChange: (phoneE164: string) => void;
  onConfirmChange: (phoneE164: string, code: string) => Promise<boolean>;
  onCancelChange: () => void;
}

export function PhoneNumberSection({
  profile,
  onStartChange,
  onConfirmChange,
  onCancelChange,
}: PhoneNumberSectionProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [countryCode, setCountryCode] = useState(
    profile.phoneE164.match(/^\+\d{1,3}/)?.[0] ?? getDefaultPhoneCountryCode()
  );
  const [nationalNumber, setNationalNumber] = useState(
    profile.phoneE164.replace(/^\+\d{1,3}/, "")
  );
  const [showOtp, setShowOtp] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  const displayPhone = profile.pendingPhoneE164 ?? profile.phoneE164;
  const status = getPhoneStatus(profile);

  const handleRequestChange = () => {
    const e164 = toE164(countryCode, nationalNumber);
    onStartChange(e164);
    setPendingPhone(e164);
    setShowOtp(true);
    setIsEditing(false);
  };

  return (
    <section className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Phone number</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Used for WhatsApp booking updates
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            status === "verified" && "bg-emerald-100 text-emerald-800",
            status === "pending" && "bg-amber-100 text-amber-800",
            status === "unverified" && "bg-slate-100 text-slate-600"
          )}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      {!isEditing ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-medium text-foreground">
            {showPhone ? displayPhone : maskPhone(displayPhone)}
            <button
              type="button"
              onClick={() => setShowPhone((v) => !v)}
              className="ml-2 text-muted-foreground hover:text-foreground"
              aria-label={showPhone ? "Hide phone" : "Show phone"}
            >
              {showPhone ? <EyeOff className="inline size-4" /> : <Eye className="inline size-4" />}
            </button>
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm font-medium text-brand hover:underline"
          >
            Change number
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <PhoneInput
            countryCode={countryCode}
            nationalNumber={nationalNumber}
            onCountryCodeChange={setCountryCode}
            onNationalNumberChange={setNationalNumber}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleRequestChange}
              className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              Verify new number
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showOtp && pendingPhone && (
        <OtpVerificationModal
          phoneE164={pendingPhone}
          onVerified={() => {
            setShowOtp(false);
          }}
          onSkip={() => {
            onCancelChange();
            setShowOtp(false);
          }}
          verify={(code) => onConfirmChange(pendingPhone, code)}
        />
      )}
    </section>
  );
}
