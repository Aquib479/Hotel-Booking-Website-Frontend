import { Link } from "react-router-dom";
import { CalendarPlus, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingDetail } from "../types";
import { downloadBookingCalendarEvent } from "../lib/calendarExport";

interface ConfirmationShareActionsProps {
  booking: BookingDetail;
}

export function ConfirmationShareActions({ booking }: ConfirmationShareActionsProps) {
  const { t } = useLanguage();
  const detailHref = `/bookings/${booking.id}`;
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleShare = async () => {
    if (!canShare) return;
    try {
      await navigator.share({
        title: t("bookings.shareTitle", { hotel: booking.hotelName }),
        text: t("bookings.shareText", {
          code: booking.confirmationCode,
          hotel: booking.hotelName,
        }),
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
        {t("bookings.addCalendar")}
      </Button>

      <Button variant="brand" className="flex-1 sm:min-w-[160px] sm:flex-none" asChild>
        <Link to={detailHref}>
          {t("bookings.viewDetails")}
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
          {t("common.share")}
        </Button>
      )}
    </div>
  );
}
