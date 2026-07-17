import { Link } from "react-router-dom";
import { CalendarPlus, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingDetail } from "../types";
import { downloadBookingCalendarEvent } from "../lib/calendarExport";

interface ConfirmationShareActionsProps {
  booking: BookingDetail;
}

export function ConfirmationShareActions({ booking }: ConfirmationShareActionsProps) {
  const detailHref = `/bookings/${booking.id}`;
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleShare = async () => {
    if (!canShare) return;
    try {
      await navigator.share({
        title: `RestHalf booking — ${booking.hotelName}`,
        text: `Booking ${booking.confirmationCode} at ${booking.hotelName}`,
        url: window.location.origin + detailHref,
      });
    } catch {
      /* user dismissed */
    }
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        type="button"
        variant="outline"
        className="flex-1 sm:min-w-[160px] sm:flex-none"
        onClick={() => downloadBookingCalendarEvent(booking)}
      >
        <CalendarPlus />
        Add to calendar
      </Button>

      <Button variant="brand" className="flex-1 sm:min-w-[160px] sm:flex-none" asChild>
        <Link to={detailHref}>
          View booking details
          <ArrowRight />
        </Link>
      </Button>

      {canShare && (
        <Button
          type="button"
          variant="ghost"
          className="flex-1 sm:min-w-[120px] sm:flex-none"
          onClick={() => void handleShare()}
        >
          <Share2 />
          Share
        </Button>
      )}
    </div>
  );
}
