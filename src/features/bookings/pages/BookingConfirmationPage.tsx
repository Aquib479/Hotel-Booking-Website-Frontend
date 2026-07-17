import { useParams } from "react-router-dom";
import { NoActiveDraftState } from "@/features/checkout/components/NoActiveDraftState";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useBookingConfirmation } from "../hooks/useBookingConfirmation";
import { BookingDetailSkeleton } from "../components/BookingDetailSkeleton";
import { ConfirmationHero } from "../components/ConfirmationHero";
import { ConfirmationSummaryCard } from "../components/ConfirmationSummaryCard";
import { ConfirmationSlotInstructions } from "../components/ConfirmationSlotInstructions";
import { ConfirmationWholesaleNotice } from "../components/ConfirmationWholesaleNotice";
import { ConfirmationNextSteps } from "../components/ConfirmationNextSteps";
import { ConfirmationShareActions } from "../components/ConfirmationShareActions";
import { ConfirmationSupportPrompt } from "../components/ConfirmationSupportPrompt";

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const redirectPath = `/bookings/${id ?? ""}/confirmation`;

  const { isAuthenticated } = useRequireAuth(redirectPath);
  const { booking, isLoading, error, phase } = useBookingConfirmation(id);

  if (!isAuthenticated) return null;

  if (isLoading || phase === "loading" || phase === "redirecting") {
    return <BookingDetailSkeleton />;
  }

  if (error === "network") {
    return (
      <main className="mx-auto max-w-lg px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t load your confirmation. Please try again.
        </p>
      </main>
    );
  }

  if (error === "not_found" || !booking) {
    return (
      <NoActiveDraftState
        title="Booking not found"
        body="We couldn't find this booking on your account. It may have been removed or you may not have access."
        cta="Back to My Bookings"
        searchHref="/bookings"
      />
    );
  }

  const showDetails = phase === "confirmed" || phase === "confirming_payment";

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-8 sm:py-10">
      <ConfirmationHero booking={booking} phase={phase} />

      {showDetails && (
        <>
          <ConfirmationSummaryCard booking={booking} />
          <ConfirmationSlotInstructions booking={booking} />
          <ConfirmationWholesaleNotice booking={booking} />
          <ConfirmationNextSteps booking={booking} />
          {phase === "confirmed" && <ConfirmationShareActions booking={booking} />}
          <ConfirmationSupportPrompt confirmationCode={booking.confirmationCode} />
        </>
      )}
    </main>
  );
}
