import { Clock, MapPin } from "lucide-react";
import { getSlotWindowLabel } from "@/features/checkout/constants";
import { formatRestSlotDisplay } from "@/lib/booking/dateSlotDisplay";
import { cn } from "@/lib/utils";
import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  if (booking.lane !== "direct" || booking.mode !== "rest") return null;
  if (!booking.slotDate || !booking.slotWindow) return null;

  const slotDisplay = formatRestSlotDisplay(booking.slotDate, booking.slotWindow);
  const windowLabel = getSlotWindowLabel(booking.slotWindow);
  const startingSoon = isSlotStartingSoon(booking);
  const minutesUntil = getMinutesUntilSlotStart(booking);

  return (
    <SectionCard title="Check-in instructions">
      {startingSoon && minutesUntil !== null && minutesUntil >= 0 && (
        <Alert
          className={cn(
            minutesUntil <= 60
              ? "animate-pulse border-amber-300 bg-amber-50"
              : "border-brand/30 bg-brand/5"
          )}
        >
          <Clock
            className={cn(
              minutesUntil <= 60 ? "text-amber-600" : "text-brand"
            )}
          />
          <AlertTitle>Slot starts in {formatMinutesUntilStart(minutesUntil)}</AlertTitle>
          <AlertDescription>
            Head to the hotel soon — your window is {windowLabel}
          </AlertDescription>
        </Alert>
      )}

      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        <li className="flex gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            Go to the front desk at <strong className="text-foreground">{booking.hotelName}</strong>
            , {booking.address}.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="mt-0.5 size-4 shrink-0 text-center text-xs font-bold text-brand">
            #
          </span>
          <span>
            Show your booking reference{" "}
            <strong className="font-mono text-foreground">{booking.confirmationCode}</strong> at
            check-in.
          </span>
        </li>
        <li className="flex gap-2">
          <Clock className="mt-0.5 size-4 shrink-0 text-brand" />
          <span>
            Your slot is <strong className="text-foreground">{slotDisplay.primary}</strong>,{" "}
            {windowLabel} ({booking.slotWindow === "24h" ? "24h" : "12h"} window). Arrive within
            this window — late arrival may shorten your rest time.
          </span>
        </li>
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Same details are in your WhatsApp confirmation. Keep that message handy if you&apos;re
        heading straight from the airport.
      </p>

      {minutesUntil !== null && minutesUntil >= 0 && minutesUntil <= SLOT_STARTING_SOON_HOURS * 60 && (
        <span className="sr-only">
          Your rest slot starts in {formatMinutesUntilStart(minutesUntil)}
        </span>
      )}
    </SectionCard>
  );
}
