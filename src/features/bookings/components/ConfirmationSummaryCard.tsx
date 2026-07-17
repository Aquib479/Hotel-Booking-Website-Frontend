import { formatPrice } from "@/lib/currency/format";
import { Card } from "@/components/ui/card";
import type { BookingDetail } from "../types";
import { BookingDetailSummaryCard } from "./BookingDetailSummaryCard";

interface ConfirmationSummaryCardProps {
  booking: BookingDetail;
}

export function ConfirmationSummaryCard({ booking }: ConfirmationSummaryCardProps) {
  return (
    <section aria-labelledby="confirmation-summary-heading">
      <h2 id="confirmation-summary-heading" className="sr-only">
        Booking summary
      </h2>
      <BookingDetailSummaryCard booking={booking} />
      <Card padding="none" className="mt-3 bg-muted/20">
        <div className="flex items-center justify-between p-4 text-sm sm:px-5">
          <span className="text-muted-foreground">Amount paid</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(booking.paidAmount, booking.paidCurrency)}
          </span>
        </div>
      </Card>
    </section>
  );
}
