import { Link, useNavigate } from "react-router-dom";
import {
  BOOK_AGAIN_DIRECT_TO_DETAIL,
  BOOK_AGAIN_WHOLESALE_TO_SEARCH,
  SUPPORT_CONTACT_HREF,
} from "../constants";
import type { BookingDetail, BookingEligibility } from "../types";
import { classifyBookingStatus } from "../utils";
import { DirectCancelEligibility } from "./DirectCancelEligibility";
import { WholesaleCancelRedirectNotice } from "./WholesaleCancelRedirectNotice";

interface BookingActionBarProps {
  booking: BookingDetail;
  eligibility: BookingEligibility;
}

function getBookAgainHref(booking: BookingDetail): string {
  if (booking.lane === "wholesale" && BOOK_AGAIN_WHOLESALE_TO_SEARCH) {
    return `/search?location=${encodeURIComponent(booking.city)}`;
  }
  if (BOOK_AGAIN_DIRECT_TO_DETAIL) {
    return `/properties/${booking.propertyId}`;
  }
  return "/search";
}

export function BookingActionBar({ booking, eligibility }: BookingActionBarProps) {
  const navigate = useNavigate();
  const status = classifyBookingStatus(booking);

  if (status === "cancelled") {
    return null;
  }

  if (status === "past") {
    return (
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(getBookAgainHref(booking))}
          className="rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Book again
        </button>
      </div>
    );
  }

  if (booking.lane === "wholesale") {
    return <WholesaleCancelRedirectNotice booking={booking} />;
  }

  if (eligibility.slotInProgress) {
    return (
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Your slot is in progress.{" "}
        <a href={SUPPORT_CONTACT_HREF} className="font-medium text-brand hover:underline">
          Contact support
        </a>{" "}
        if you need help.
      </div>
    );
  }

  if (eligibility.canCancel) {
    return (
      <Link
        to={`/bookings/${booking.id}/cancel`}
        className="inline-flex rounded-xl border-2 border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-700 hover:bg-red-100"
      >
        Cancel booking
      </Link>
    );
  }

  if (eligibility.cancelCutoffPassed && eligibility.cancelCutoffTime) {
    return (
      <div className="space-y-3">
        <DirectCancelEligibility cancelCutoffTime={eligibility.cancelCutoffTime} />
        {eligibility.showContactSupport && (
          <a
            href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(booking.confirmationCode)}`}
            className="inline-block text-sm font-medium text-brand hover:underline"
          >
            Contact support
          </a>
        )}
      </div>
    );
  }

  if (eligibility.showContactSupport) {
    return (
      <a
        href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(booking.confirmationCode)}`}
        className="inline-flex rounded-xl border border-border px-6 py-3 text-sm font-semibold hover:bg-muted/50"
      >
        Contact support
      </a>
    );
  }

  return null;
}
