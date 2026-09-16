import type { BookingMode } from "@/lib/booking/types";
import type { RestSlot } from "@/lib/booking/types";
import { getBookingDateOrSlotDisplay } from "@/lib/booking/dateSlotDisplay";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language } = useLanguage();
  const display = getBookingDateOrSlotDisplay(
    mode,
    {
      slotDate,
      slotWindow,
      checkIn,
      checkOut,
      nights,
    },
    { language }
  );

  if (!display) return null;

  return (
    <div className="rounded-xl bg-muted/40 px-4 py-3 text-sm">
      <p className="font-medium text-foreground">{display.primary}</p>
      <p className="mt-0.5 text-muted-foreground">{display.secondary}</p>
    </div>
  );
}
