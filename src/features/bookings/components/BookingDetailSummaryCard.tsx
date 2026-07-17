import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HotelSummaryHeader } from "@/features/checkout/components/HotelSummaryHeader";
import type { BookingDetail } from "../types";
import { BookingCardDateOrSlot } from "./BookingCardDateOrSlot";

interface BookingDetailSummaryCardProps {
  booking: BookingDetail;
}

export function BookingDetailSummaryCard({ booking }: BookingDetailSummaryCardProps) {
  const guestLabel = [
    `${booking.guests.adults} adult${booking.guests.adults !== 1 ? "s" : ""}`,
    booking.guests.children > 0
      ? `${booking.guests.children} child${booking.guests.children !== 1 ? "ren" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Card padding="none">
      <CardContent className="space-y-0 p-0 sm:p-0">
        <HotelSummaryHeader
          imageUrl={booking.hotelImage}
          name={booking.hotelName}
          location={booking.address}
          starRating={booking.starRating}
          lane={booking.lane}
        />

        <Separator />

        <div className="space-y-4 p-4 sm:p-5">
          <BookingCardDateOrSlot
            mode={booking.mode}
            slotDate={booking.slotDate}
            slotWindow={booking.slotWindow}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            nights={booking.nights}
          />

          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Guests</dt>
              <dd className="font-medium text-foreground">{guestLabel}</dd>
            </div>
            {booking.ratePlanName && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Rate plan</dt>
                <dd className="max-w-[60%] text-right font-medium text-foreground">
                  {booking.ratePlanName}
                </dd>
              </div>
            )}
            {booking.roomType && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Room type</dt>
                <dd className="font-medium capitalize text-foreground">{booking.roomType}</dd>
              </div>
            )}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
