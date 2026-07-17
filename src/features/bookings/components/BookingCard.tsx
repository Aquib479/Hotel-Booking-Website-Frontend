import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { CardImageRow, CardThumbnail } from "@/components/common/CardImageRow";
import { formatPrice } from "@/lib/currency/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { BookingRecord } from "../types";
import {
  BOOK_AGAIN_DIRECT_TO_DETAIL,
  BOOK_AGAIN_WHOLESALE_TO_SEARCH,
  BOOKINGS_STATUS_PARAM,
  DEFAULT_BOOKING_STATUS,
} from "../constants";
import { classifyBookingStatus, isSlotStartingSoon } from "../utils";
import { BookingCardDateOrSlot } from "./BookingCardDateOrSlot";
import { BookingCardStatusPill } from "./BookingCardStatusPill";

interface BookingCardProps {
  booking: BookingRecord;
}

function getPrimaryAction(booking: BookingRecord): { label: string; href?: string } {
  const status = classifyBookingStatus(booking);

  if (status === "upcoming") {
    if (booking.lane === "direct") {
      return { label: "View slot details" };
    }
    return { label: "View booking" };
  }

  if (status === "past") {
    return { label: "Book again" };
  }

  return { label: "View refund status" };
}

function getBookAgainHref(booking: BookingRecord): string {
  if (booking.lane === "wholesale" && BOOK_AGAIN_WHOLESALE_TO_SEARCH) {
    return `/search?location=${encodeURIComponent(booking.city)}`;
  }
  if (BOOK_AGAIN_DIRECT_TO_DETAIL) {
    return `/properties/${booking.propertyId}`;
  }
  return `/search`;
}

export function BookingCard({ booking }: BookingCardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromStatus = searchParams.get(BOOKINGS_STATUS_PARAM) ?? DEFAULT_BOOKING_STATUS;
  const status = classifyBookingStatus(booking);
  const startingSoon = status === "upcoming" && isSlotStartingSoon(booking);
  const action = getPrimaryAction(booking);
  const detailHref = `/bookings/${booking.id}`;
  const paidLabel = formatPrice(booking.paidAmount, booking.paidCurrency);

  const handleCardClick = () =>
    navigate(detailHref, { state: { fromStatus } });

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (action.label === "Book again") {
      navigate(getBookAgainHref(booking));
      return;
    }
    navigate(detailHref, { state: { fromStatus } });
  };

  return (
    <Card
      padding="none"
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        startingSoon && "border-brand ring-2 ring-brand/20"
      )}
    >
      <CardImageRow
        image={
          <CardThumbnail
            src={booking.hotelImage}
            alt={booking.hotelName}
            size="lg"
            className="sm:min-h-[8.5rem]"
          />
        }
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-semibold leading-snug text-foreground">
              {booking.hotelName}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {booking.city}, {booking.country}
            </p>
          </div>
          {startingSoon && (
            <Badge variant="brand" className="shrink-0 gap-1 uppercase">
              <Clock className="size-3" />
              Starting soon
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <LaneBadge lane={booking.lane} />
          <BookingCardStatusPill booking={booking} />
        </div>

        <BookingCardDateOrSlot
          mode={booking.mode}
          slotDate={booking.slotDate}
          slotWindow={booking.slotWindow}
          checkIn={booking.checkIn}
          checkOut={booking.checkOut}
          nights={booking.nights}
          emphasized={startingSoon}
        />

        {booking.lane === "wholesale" && status === "upcoming" && (
          <p className="text-xs leading-relaxed text-muted-foreground">
            Cancellations follow partner policy — not RestHalf&apos;s refund engine.
          </p>
        )}

        {booking.cancelReason && status === "cancelled" && (
          <p className="text-xs text-muted-foreground">Reason: {booking.cancelReason}</p>
        )}

        <Separator className="my-1" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="font-bold text-foreground">{paidLabel}</p>
          </div>
          <Button
            type="button"
            variant={startingSoon ? "brand" : "outline"}
            size="sm"
            onClick={handleAction}
          >
            {action.label}
          </Button>
        </div>

        <Link
          to={detailHref}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
        >
          View booking {booking.confirmationCode}
        </Link>
      </CardImageRow>
    </Card>
  );
}
