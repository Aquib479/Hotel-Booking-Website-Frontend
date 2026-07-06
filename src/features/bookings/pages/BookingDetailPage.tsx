import { useLocation, useParams } from "react-router-dom";
import { NoActiveDraftState } from "@/features/checkout/components/NoActiveDraftState";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { useBookingEligibility } from "../hooks/useBookingEligibility";
import { resolveStatusBannerMessage } from "../statusMessage";
import type { BookingTabStatus } from "../types";
import { BookingDetailSkeleton } from "../components/BookingDetailSkeleton";
import { BookingDetailHeader } from "../components/BookingDetailHeader";
import { BookingDetailStatusBanner } from "../components/BookingDetailStatusBanner";
import { BookingDetailSummaryCard } from "../components/BookingDetailSummaryCard";
import { BookingDetailGuestInfo } from "../components/BookingDetailGuestInfo";
import { BookingDetailPaymentInfo } from "../components/BookingDetailPaymentInfo";
import { BookingDetailPolicyPanel } from "../components/BookingDetailPolicyPanel";
import { BookingActionBar } from "../components/BookingActionBar";
import { RefundStatusTracker } from "../components/RefundStatusTracker";
import { BookingSupportPrompt } from "../components/BookingSupportPrompt";
import { classifyBookingStatus } from "../utils";

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const fromStatus = (location.state as { fromStatus?: BookingTabStatus } | null)?.fromStatus;

  const { isAuthenticated } = useRequireAuth(`/bookings/${id ?? ""}`);
  const { booking, isLoading, error } = useBookingDetail(id);
  const eligibility = useBookingEligibility(booking);

  if (!isAuthenticated) return null;

  if (isLoading) {
    return <BookingDetailSkeleton />;
  }

  if (error === "network") {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t load this booking. Please try again.
        </p>
      </main>
    );
  }

  if (error === "not_found" || !booking || !eligibility) {
    return (
      <NoActiveDraftState
        title="Booking not found"
        body="We couldn't find this booking on your account. It may have been removed or you may not have access."
        cta="Back to My Bookings"
        searchHref="/bookings"
      />
    );
  }

  const banner = resolveStatusBannerMessage(booking);
  const status = classifyBookingStatus(booking);
  const showRefundTracker =
    status === "cancelled" &&
    booking.refund &&
    (booking.refund.status === "pending" || booking.refund.status === "refunded");

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-8">
      <BookingDetailHeader booking={booking} fromStatus={fromStatus} />

      <BookingDetailStatusBanner banner={banner} />

      <BookingDetailSummaryCard booking={booking} />

      <BookingDetailGuestInfo guest={booking.guest} />

      <BookingDetailPaymentInfo booking={booking} />

      <BookingDetailPolicyPanel policy={booking.policy} />

      {showRefundTracker && booking.refund && (
        <RefundStatusTracker refund={booking.refund} />
      )}

      <BookingActionBar booking={booking} eligibility={eligibility} />

      <BookingSupportPrompt confirmationCode={booking.confirmationCode} />
    </main>
  );
}
