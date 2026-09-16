import type { BookingMode, RestSlot } from "@/lib/booking/types";
import { getBookingDateOrSlotDisplay } from "@/lib/booking/dateSlotDisplay";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface BookingCardDateOrSlotProps {
  mode: BookingMode;
  slotDate?: string;
  slotWindow?: RestSlot;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  emphasized?: boolean;
  className?: string;
}

export function BookingCardDateOrSlot({
  mode,
  slotDate,
  slotWindow,
  checkIn,
  checkOut,
  nights,
  emphasized = false,
  className,
}: BookingCardDateOrSlotProps) {
  const { language } = useLanguage();
  const display = getBookingDateOrSlotDisplay(
    mode,
    { slotDate, slotWindow, checkIn, checkOut, nights },
    { compact: true, language }
  );

  if (!display) return null;

  return (
    <div
      className={cn(
        "text-sm",
        emphasized ? "rounded-lg border border-brand/40 bg-brand/5 px-3 py-2" : "",
        className
      )}
    >
      <p className={cn("font-semibold text-foreground", emphasized && "text-brand")}>
        {display.primary}
      </p>
      <p className="mt-0.5 text-muted-foreground">{display.secondary}</p>
    </div>
  );
}
