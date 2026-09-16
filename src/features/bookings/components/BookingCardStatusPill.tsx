import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingRecord } from "../types";
import { classifyBookingStatus } from "../utils";

interface BookingCardStatusPillProps {
  booking: BookingRecord;
  className?: string;
}

export function BookingCardStatusPill({ booking, className }: BookingCardStatusPillProps) {
  const { t } = useLanguage();
  const tabStatus = classifyBookingStatus(booking);

  if (booking.refundStatus === "pending") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800",
          className
        )}
      >
        {t("bookings.refundPending")}
      </span>
    );
  }

  if (tabStatus === "cancelled") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700",
          className
        )}
      >
        {t("bookings.cancelled")}
      </span>
    );
  }

  if (tabStatus === "past") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600",
          className
        )}
      >
        {t("bookings.completed")}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-800",
        className
      )}
    >
      {t("bookings.upcoming")}
    </span>
  );
}
