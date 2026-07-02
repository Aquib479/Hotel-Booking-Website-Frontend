import { format, parseISO } from "date-fns";
import type { BookingMode } from "@/lib/booking/types";
import type { RestSlot } from "@/lib/booking/types";
import { getSlotWindowLabel } from "../constants";

interface DateOrSlotSummaryProps {
  mode: BookingMode;
  slotDate?: string;
  slotWindow?: RestSlot;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
}

export function DateOrSlotSummary({
  mode,
  slotDate,
  slotWindow,
  checkIn,
  checkOut,
  nights,
}: DateOrSlotSummaryProps) {
  if (mode === "rest" && slotDate && slotWindow) {
    const date = parseISO(slotDate);
    const dateLabel = format(date, "EEE, MMM d, yyyy");
    const windowLabel = getSlotWindowLabel(slotWindow);
    const duration = slotWindow === "24h" ? "24h slot" : "12h slot";

    return (
      <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
        <p className="font-medium text-foreground">{dateLabel}</p>
        <p className="mt-0.5 text-muted-foreground">
          {windowLabel} ({duration})
        </p>
      </div>
    );
  }

  if (checkIn && checkOut) {
    const inDate = format(parseISO(checkIn), "MMM d");
    const outDate = format(parseISO(checkOut), "MMM d, yyyy");
    const nightCount = nights ?? 1;

    return (
      <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
        <p className="font-medium text-foreground">
          {inDate} – {outDate}
        </p>
        <p className="mt-0.5 text-muted-foreground">
          {nightCount} night{nightCount !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return null;
}
