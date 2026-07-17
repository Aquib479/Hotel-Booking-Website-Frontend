import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <Button variant="ghost" className="h-auto px-0 text-muted-foreground hover:text-foreground" asChild>
        <Link to={backHref}>
          <ArrowLeft className="size-4" />
          Back to My Bookings
        </Link>
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{booking.hotelName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <LaneBadge lane={booking.lane} className="text-xs" />
            <BookingCardStatusPill booking={booking} />
          </div>
        </div>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Confirmation
            </p>
            <p className="font-mono text-lg font-semibold text-foreground">
              {booking.confirmationCode}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void handleCopy()}
            aria-label={copied ? "Copied" : "Copy confirmation number"}
          >
            {copied ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4 text-muted-foreground" />
            )}
          </Button>
        </CardContent>
      </Card>
    </header>
  );
}
