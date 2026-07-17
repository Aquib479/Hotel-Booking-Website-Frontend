import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { OtpVerificationModal } from "@/features/auth/components/OtpVerificationModal";
import { getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { toE164 } from "@/lib/phone/validation";
import { SectionCard } from "@/components/common/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile, PhoneVerificationStatus } from "../types";

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

const STATUS_VARIANT: Record<
  PhoneVerificationStatus,
  "success" | "secondary" | "outline"
> = {
  verified: "success",
  pending: "secondary",
  unverified: "outline",
};

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
    <SectionCard
      title="Phone number"
      description="Used for WhatsApp booking updates"
      action={
        <Badge variant={STATUS_VARIANT[status]} className="uppercase">
          {STATUS_LABELS[status]}
        </Badge>
      }
    >
      {!isEditing ? (
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">
            {showPhone ? displayPhone : maskPhone(displayPhone)}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPhone((v) => !v)}
              aria-label={showPhone ? "Hide phone" : "Show phone"}
            >
              {showPhone ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </p>
          <Button type="button" variant="link" className="h-auto p-0" onClick={() => setIsEditing(true)}>
            Change number
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <PhoneInput
            countryCode={countryCode}
            nationalNumber={nationalNumber}
            onCountryCodeChange={setCountryCode}
            onNationalNumberChange={setNationalNumber}
          />
          <div className="flex gap-2">
            <Button type="button" variant="brand" onClick={handleRequestChange}>
              Verify new number
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showOtp && pendingPhone && (
        <OtpVerificationModal
          phoneE164={pendingPhone}
          onVerified={() => setShowOtp(false)}
          onSkip={() => {
            onCancelChange();
            setShowOtp(false);
          }}
          verify={(code) => onConfirmChange(pendingPhone, code)}
        />
      )}
    </SectionCard>
  );
}
