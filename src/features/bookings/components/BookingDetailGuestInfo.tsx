import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { BookingGuestInfo } from "../types";

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
  const [showPhone, setShowPhone] = useState(false);

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h2 className="text-sm font-semibold text-foreground">Guest information</h2>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="font-medium text-foreground">{guest.fullName}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="font-medium text-foreground">{guest.email}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="flex items-center gap-2 font-medium text-foreground">
            {showPhone ? guest.phoneE164 : maskPhone(guest.phoneE164)}
            <button
              type="button"
              onClick={() => setShowPhone((v) => !v)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={showPhone ? "Hide phone number" : "Show phone number"}
            >
              {showPhone ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </dd>
        </div>
        {guest.specialRequests && (
          <div className="border-t border-border pt-2">
            <dt className="text-muted-foreground">Special requests</dt>
            <dd className="mt-1 text-foreground">{guest.specialRequests}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
