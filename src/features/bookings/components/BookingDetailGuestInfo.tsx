import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import type { BookingGuestInfo } from "../types";
import { useLanguage } from "@/context/LanguageContext";

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return phone;
  const country = phone.startsWith("+") ? phone.slice(0, 3) : "";
  const last = digits.slice(-4);
  return `${country} ${digits.slice(3, 4)}•• •••• ${last}`.trim();
}

interface BookingDetailGuestInfoProps {
  guest: BookingGuestInfo;
}

export function BookingDetailGuestInfo({ guest }: BookingDetailGuestInfoProps) {
  const { t } = useLanguage();
  const [showPhone, setShowPhone] = useState(false);

  return (
    <SectionCard title={t("bookings.guestInfo")} size="sm">
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("common.name")}</dt>
          <dd className="font-medium text-foreground">{guest.fullName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("common.email")}</dt>
          <dd className="font-medium text-foreground">{guest.email}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">{t("common.phone")}</dt>
          <dd className="flex items-center gap-2 font-medium text-foreground">
            {showPhone ? guest.phoneE164 : maskPhone(guest.phoneE164)}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPhone((v) => !v)}
              aria-label={showPhone ? t("bookings.hidePhone") : t("bookings.showPhone")}
            >
              {showPhone ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </dd>
        </div>
        {guest.specialRequests && (
          <div className="border-t border-border pt-2">
            <dt className="text-muted-foreground">{t("bookings.specialRequests")}</dt>
            <dd className="mt-1 text-foreground">{guest.specialRequests}</dd>
          </div>
        )}
      </dl>
    </SectionCard>
  );
}
