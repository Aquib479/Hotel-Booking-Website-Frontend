import { Clock, MapPin } from "lucide-react";
import { getSlotWindowLabel } from "@/features/checkout/constants";
import { formatRestSlotDisplay } from "@/lib/booking/dateSlotDisplay";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingDetail } from "../types";
import { SLOT_STARTING_SOON_HOURS } from "../constants";
import { getMinutesUntilSlotStart, isSlotStartingSoon } from "../utils";

function formatMinutesUntilStart(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

interface ConfirmationSlotInstructionsProps {
  booking: BookingDetail;
}

export function ConfirmationSlotInstructions({ booking }: ConfirmationSlotInstructionsProps) {
  const { language, t } = useLanguage();
  if (booking.lane !== "direct" || booking.mode !== "rest") return null;
  if (!booking.slotDate || !booking.slotWindow) return null;

  const slotDisplay = formatRestSlotDisplay(booking.slotDate, booking.slotWindow, { language });
  const windowLabel = getSlotWindowLabel(booking.slotWindow, language);
  const startingSoon = isSlotStartingSoon(booking);
  const minutesUntil = getMinutesUntilSlotStart(booking);
  const duration = booking.slotWindow === "24h" ? "24h" : "12h";

  return (
    <SectionCard title={t("bookings.checkinTitle")}>
      {startingSoon && minutesUntil !== null && minutesUntil >= 0 && (
        <Alert
          className={cn(
            minutesUntil <= 60
              ? "animate-pulse border-amber-300 bg-amber-50"
              : "border-brand/30 bg-brand/5"
          )}
        >
          <Clock className={cn(minutesUntil <= 60 ? "text-amber-600" : "text-brand")} />
          <AlertTitle>
            {t("bookings.slotStartsIn", { time: formatMinutesUntilStart(minutesUntil) })}
          </AlertTitle>
          <AlertDescription>{t("bookings.headToHotel", { window: windowLabel })}</AlertDescription>
        </Alert>
      )}

      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li className="flex gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>{t("bookings.goFrontDesk", { hotel: booking.hotelName, address: booking.address })}</span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 size-4 shrink-0 text-center text-xs font-bold text-brand">#</span>
          <span>{t("bookings.showRef", { code: booking.confirmationCode })}</span>
        </li>
        <li className="flex gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            {t("bookings.slotWindowHint", {
              slot: slotDisplay.primary,
              window: windowLabel,
              duration,
            })}
          </span>
        </li>
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">{t("bookings.whatsAppHandy")}</p>

      {minutesUntil !== null && minutesUntil >= 0 && minutesUntil <= SLOT_STARTING_SOON_HOURS * 60 && (
        <span className="sr-only">
          {t("bookings.restStartsIn", { time: formatMinutesUntilStart(minutesUntil) })}
        </span>
      )}
    </SectionCard>
  );
}
