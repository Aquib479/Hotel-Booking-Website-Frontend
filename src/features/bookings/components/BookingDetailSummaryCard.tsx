import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HotelSummaryHeader } from "@/features/checkout/components/HotelSummaryHeader";
import type { BookingDetail } from "../types";
import { BookingCardDateOrSlot } from "./BookingCardDateOrSlot";
import { useLanguage } from "@/context/LanguageContext";

interface BookingDetailSummaryCardProps {
  booking: BookingDetail;
}

export function BookingDetailSummaryCard({ booking }: BookingDetailSummaryCardProps) {
  const { t } = useLanguage();
  const guestLabel = [
    booking.guests.adults === 1
      ? t("common.adultCountOne")
      : t("common.adultCountN", { n: booking.guests.adults }),
    booking.guests.children > 0
      ? booking.guests.children === 1
        ? t("common.childCountOne")
        : t("common.childCountN", { n: booking.guests.children })
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
              <dt className="text-muted-foreground">{t("common.guests")}</dt>
              <dd className="font-medium text-foreground">{guestLabel}</dd>
            </div>
            {booking.ratePlanName && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("bookings.ratePlan")}</dt>
                <dd className="max-w-[60%] text-right font-medium text-foreground">
                  {booking.ratePlanName}
                </dd>
              </div>
            )}
            {booking.roomType && (
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("bookings.roomType")}</dt>
                <dd className="font-medium capitalize text-foreground">{booking.roomType}</dd>
              </div>
            )}
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
