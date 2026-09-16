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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const status = classifyBookingStatus(booking);

  if (status === "cancelled") {
    return null;
  }

  if (status === "past") {
    return (
      <Button variant="brand" onClick={() => navigate(getBookAgainHref(booking))}>
        {t("bookings.bookAgain")}
      </Button>
    );
  }

  if (booking.lane === "wholesale") {
    return <WholesaleCancelRedirectNotice booking={booking} />;
  }

  if (eligibility.slotInProgress) {
    return (
      <Alert>
        <AlertDescription>
          {t("bookings.slotInProgress")}{" "}
          <a href={SUPPORT_CONTACT_HREF} className="font-medium text-brand hover:underline">
            {t("bookings.contactSupport")}
          </a>{" "}
          {t("bookings.ifNeedHelp")}
        </AlertDescription>
      </Alert>
    );
  }

  if (eligibility.canCancel) {
    return (
      <Button variant="destructive" className="bg-red-50 text-red-700 hover:bg-red-100" asChild>
        <Link to={`/bookings/${booking.id}/cancel`}>{t("bookings.cancel")}</Link>
      </Button>
    );
  }

  if (eligibility.cancelCutoffPassed && eligibility.cancelCutoffTime) {
    return (
      <div className="space-y-3">
        <DirectCancelEligibility cancelCutoffTime={eligibility.cancelCutoffTime} />
        {eligibility.showContactSupport && (
          <Button variant="link" className="h-auto p-0" asChild>
            <a
              href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(booking.confirmationCode)}`}
            >
              {t("bookings.contactSupport")}
            </a>
          </Button>
        )}
      </div>
    );
  }

  if (eligibility.showContactSupport) {
    return (
      <Button variant="outline" asChild>
        <a
          href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(booking.confirmationCode)}`}
        >
          {t("bookings.contactSupport")}
        </a>
      </Button>
    );
  }

  return null;
}
