import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/currency/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { BOOKINGS_STATUS_PARAM, REFUND_TIMELINE_KEY, REFUND_TIMELINE_TEXT } from "../constants";
import type { CancelBookingResult } from "../types";

interface CancelConfirmationStepProps {
  bookingId: string;
  hotelName: string;
  result: CancelBookingResult;
}

export function CancelConfirmationStep({
  bookingId,
  hotelName,
  result,
}: CancelConfirmationStepProps) {
  const { t } = useLanguage();
  const isZeroRefund = result.refundAmount === 0;

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
        <CheckCircle className="size-8 text-emerald-600" />
      </div>

      <div>
        <h1 className="text-xl font-bold text-foreground">{t("bookings.bookingCancelled")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("bookings.cancelledAtHotel", { hotel: hotelName })}
        </p>
      </div>

      <Card className="bg-muted/30 text-left">
        <CardContent className="text-sm">
          {!isZeroRefund ? (
            <>
              <p className="font-semibold text-foreground">
                {t("bookings.refundLabel", {
                  amount: formatPrice(result.refundAmount, result.currency),
                })}
              </p>
              <p className="mt-1 text-muted-foreground">
                {result.timelineText === REFUND_TIMELINE_TEXT
                  ? t(REFUND_TIMELINE_KEY)
                  : result.timelineText}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">{t("bookings.cancelComplete")}</p>
            </>
          ) : (
            <p className="font-medium text-foreground">{t("bookings.noRefundStatus")}</p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="brand" asChild>
          <Link to={`/bookings?${BOOKINGS_STATUS_PARAM}=cancelled`}>
            {t("bookings.viewCancelled")}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/bookings/${bookingId}`}>{t("bookings.viewDetails")}</Link>
        </Button>
      </div>
    </div>
  );
}
