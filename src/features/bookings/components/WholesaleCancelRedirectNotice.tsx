import { Link } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { WHOLESALE_CANCEL_API_ENABLED } from "../constants";
import type { BookingDetail } from "../types";

interface WholesaleCancelRedirectNoticeProps {
  booking: BookingDetail;
}

export function WholesaleCancelRedirectNotice({ booking }: WholesaleCancelRedirectNoticeProps) {
  const { t } = useLanguage();
  const supplier = booking.supplierName ?? t("bookings.thePartner");

  return (
    <Alert>
      <AlertTitle>{t("bookings.partnerCancelTitle")}</AlertTitle>
      <AlertDescription>
        <p>{t("bookings.partnerCancelBody", { supplier })}</p>
        <Button
          variant={WHOLESALE_CANCEL_API_ENABLED ? "brand" : "outline"}
          size="sm"
          className="mt-3"
          asChild
        >
          <Link to={`/bookings/${booking.id}/cancel`}>{t("bookings.requestCancel")}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
