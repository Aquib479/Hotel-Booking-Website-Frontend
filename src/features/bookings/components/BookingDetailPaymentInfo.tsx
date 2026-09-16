import { formatPrice } from "@/lib/currency/format";
import { SectionCard } from "@/components/common/SectionCard";
import type { BookingDetail } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface BookingDetailPaymentInfoProps {
  booking: BookingDetail;
}

export function BookingDetailPaymentInfo({ booking }: BookingDetailPaymentInfoProps) {
  const { t } = useLanguage();
  const { payment } = booking;

  return (
    <SectionCard title={t("bookings.payment")} size="sm">
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("bookings.amountPaid")}</dt>
          <dd className="font-bold text-foreground">
            {formatPrice(booking.paidAmount, booking.paidCurrency)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("bookings.paymentMethod")}</dt>
          <dd className="font-medium text-foreground">{payment.methodLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{t("bookings.transactionId")}</dt>
          <dd className="font-mono text-xs text-foreground">{payment.transactionId}</dd>
        </div>
        {payment.supplierBookingRef && (
          <div className="flex justify-between gap-4 border-t border-border pt-2">
            <dt className="text-muted-foreground">{t("bookings.supplierRef")}</dt>
            <dd className="font-mono text-xs text-foreground">{payment.supplierBookingRef}</dd>
          </div>
        )}
      </dl>
    </SectionCard>
  );
}
