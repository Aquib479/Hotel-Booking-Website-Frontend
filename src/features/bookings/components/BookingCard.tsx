import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Clock } from "lucide-react";
import { LaneBadge } from "@/components/common/LaneBadge";
import { formatPrice } from "@/lib/currency/format";
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
    <article
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
        "group flex cursor-pointer flex-col gap-4 rounded-2xl border bg-white p-4 transition-shadow hover:shadow-md sm:flex-row sm:items-start",
        startingSoon ? "border-brand ring-2 ring-brand/20" : "border-border"
      )}
    >
      <img
        src={booking.hotelImage}
        alt=""
        className="size-24 shrink-0 rounded-xl object-cover sm:size-28"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">{booking.hotelName}</h3>
            <p className="text-sm text-muted-foreground">
              {booking.city}, {booking.country}
            </p>
          </div>
          {startingSoon && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
              <Clock className="size-3" />
              Starting soon
            </span>
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
          <p className="text-xs text-muted-foreground">
            Cancellations follow partner policy — not RestHalf&apos;s refund engine.
          </p>
        )}

        {booking.cancelReason && status === "cancelled" && (
          <p className="text-xs text-muted-foreground">Reason: {booking.cancelReason}</p>
        )}

        <div className="mt-1 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="font-bold text-foreground">{paidLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleAction}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              startingSoon
                ? "bg-brand text-white hover:opacity-90"
                : "border border-border bg-white hover:bg-muted/50"
            )}
          >
            {action.label}
          </button>
        </div>

        <Link
          to={detailHref}
          className="sr-only"
          onClick={(e) => e.stopPropagation()}
        >
          View booking {booking.confirmationCode}
        </Link>
      </div>
    </article>
  );
}
