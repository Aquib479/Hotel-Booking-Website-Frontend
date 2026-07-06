import { cn } from "@/lib/utils";
import type { BookingRecord } from "../types";
import { classifyBookingStatus } from "../utils";

interface BookingCardStatusPillProps {
  booking: BookingRecord;
  className?: string;
}

export function BookingCardStatusPill({ booking, className }: BookingCardStatusPillProps) {
  const tabStatus = classifyBookingStatus(booking);

  if (booking.refundStatus === "pending") {
    return (
      <span
        className={cn(
          "inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800",
          className
        )}
      >
        Refund pending
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
        Cancelled
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
        Completed
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
      Upcoming
    </span>
  );
}
