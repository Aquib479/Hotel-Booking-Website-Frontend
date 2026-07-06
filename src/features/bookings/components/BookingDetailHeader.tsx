import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import type { BookingDetail } from "../types";
import type { BookingTabStatus } from "../types";
import { BOOKINGS_STATUS_PARAM, DEFAULT_BOOKING_STATUS } from "../constants";
import { BookingCardStatusPill } from "./BookingCardStatusPill";

interface BookingDetailHeaderProps {
  booking: BookingDetail;
  fromStatus?: BookingTabStatus;
}

export function BookingDetailHeader({ booking, fromStatus }: BookingDetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const status = fromStatus ?? DEFAULT_BOOKING_STATUS;
  const backHref = `/bookings?${BOOKINGS_STATUS_PARAM}=${status}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(booking.confirmationCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [booking.confirmationCode]);

  return (
    <header className="space-y-4">
      <Link
        to={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to My Bookings
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{booking.hotelName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <LaneBadge lane={booking.lane} className="text-xs" />
            <BookingCardStatusPill booking={booking} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Confirmation
          </p>
          <p className="font-mono text-lg font-semibold text-foreground">
            {booking.confirmationCode}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white hover:bg-muted/50"
          aria-label={copied ? "Copied" : "Copy confirmation number"}
        >
          {copied ? (
            <Check className="size-4 text-emerald-600" />
          ) : (
            <Copy className="size-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </header>
  );
}
