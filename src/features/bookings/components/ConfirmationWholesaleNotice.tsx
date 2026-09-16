import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingDetail } from "../types";

interface ConfirmationWholesaleNoticeProps {
  booking: BookingDetail;
}

export function ConfirmationWholesaleNotice({ booking }: ConfirmationWholesaleNoticeProps) {
  const { t } = useLanguage();
  if (booking.lane !== "wholesale") return null;

  const supplier = booking.supplierName ?? t("bookings.partnerDefault");

  return (
    <Card className="border-violet-200 bg-violet-50/50">
      <CardContent>
        <div className="flex gap-3">
          <Building2 className="size-5 shrink-0 text-violet-600" />
          <div className="min-w-0 text-sm">
            <h2 className="font-semibold text-foreground">{t("bookings.partnerBooking")}</h2>
            <p className="mt-1 text-muted-foreground">{t("bookings.partnerStay", { supplier })}</p>

            <dl className="mt-4 space-y-2 rounded-xl border border-violet-200/80 bg-white/80 px-3 py-3">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("bookings.rhReference")}</dt>
                <dd className="font-mono text-xs font-medium text-foreground">
                  {booking.confirmationCode}
                </dd>
              </div>
              {booking.payment.supplierBookingRef && (
                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <dt className="text-muted-foreground">{t("bookings.supplierRef")}</dt>
                  <dd className="font-mono text-xs font-medium text-foreground">
                    {booking.payment.supplierBookingRef}
                  </dd>
                </div>
              )}
            </dl>

            <p className="mt-3 text-xs text-muted-foreground">{t("bookings.partnerHelp")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
