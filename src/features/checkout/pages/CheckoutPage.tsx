import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { convertBetween } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { confirmBooking, releaseBooking as releaseBookingHold } from "../api";
import { useCheckoutDraft } from "../hooks/useCheckoutDraft";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import type { PaymentMethod } from "../types";
import { CheckoutLayout } from "../components/CheckoutLayout";
import { BookingSummaryCard } from "../components/BookingSummaryCard";
import { GuestDetailsForm } from "../components/GuestDetailsForm";
import { PaymentSection } from "../components/PaymentSection";
import { CancellationPolicySummary } from "../components/CancellationPolicySummary";
import { TermsAcceptance } from "../components/TermsAcceptance";
import { CheckoutCTA } from "../components/CheckoutCTA";
import { NoActiveDraftState } from "../components/NoActiveDraftState";
import { GuestCheckoutPrompt } from "../components/GuestCheckoutPrompt";
import { usePaymentMethodSelection } from "../components/DirectPaymentMethods";

const GUEST_CHECKOUT_KEY = "resthalf-checkout-guest-mode";

function toCurrencyCode(code: string | undefined): CurrencyCode {
  const upper = (code || "USD").toUpperCase();
  return CURRENCIES.some((c) => c.code === upper) ? (upper as CurrencyCode) : "USD";
}

function readGuestMode(): boolean {
  try {
    return sessionStorage.getItem(GUEST_CHECKOUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { draft, isExpired, clearDraft, saveDraft } = useCheckoutDraft();
  const { currency, format: formatCurrency } = useCurrency();
  const form = useCheckoutForm(
    user
      ? {
          fullName: user.fullName,
          email: user.email,
          phoneCountryCode: user.phoneE164.match(/^\+\d{1,3}/)?.[0] ?? "+62",
          phoneNumber: user.phoneE164.replace(/^\+\d{1,3}/, ""),
        }
      : undefined
  );
  const { selectedMethod, setSelectedMethod } = usePaymentMethodSelection();

  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [guestMode, setGuestMode] = useState(() => readGuestMode() || isAuthenticated);

  const totalPrice =
    draft?.totalPrice != null && draft.totalPrice > 0
      ? convertBetween(draft.totalPrice, toCurrencyCode(draft.currency), currency)
      : 0;
  const payAmountLabel = formatCurrency(totalPrice);

  const disabledReason = useMemo(() => {
    if (!termsAccepted) return "Accept the terms to continue";
    if (!form.isValid) return "Fill in your details to continue";
    if (draft?.lane === "direct" && !selectedMethod) return "Select a payment method";
    return undefined;
  }, [termsAccepted, form.isValid, draft?.lane, selectedMethod]);

  const isActionDisabled = Boolean(disabledReason) || isSubmitting;

  const handleHoldExpire = useCallback(() => {
    if (draft?.bookingId) {
      void releaseBookingHold(draft.bookingId);
    }
    setHoldExpired(true);
    clearDraft();
  }, [clearDraft, draft?.bookingId]);

  const handleSubmitPayment = useCallback(
    async (_method: PaymentMethod) => {
      if (!form.validateForm() || !termsAccepted || !draft) return;
      setIsSubmitting(true);
      setPaymentError(null);
      try {
        if (!draft.bookingId) {
          setPaymentError("No active booking hold. Please go back and try again.");
          return;
        }

        const result = await confirmBooking(draft.bookingId);

        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        } else if (result.snapToken) {
          const snap = (window as unknown as Record<string, unknown>).snap as
            | { pay: (token: string, opts: Record<string, unknown>) => void }
            | undefined;
          if (snap) {
            snap.pay(result.snapToken, {
              onSuccess: () => {
                clearDraft();
                navigate(`/bookings/${draft.bookingId}`);
              },
              onPending: () => {
                navigate(`/bookings/${draft.bookingId}`);
              },
              onError: () => {
                setPaymentError("Payment failed. Please try again.");
              },
              onClose: () => {
                setPaymentError("Payment window closed. You can try again before the hold expires.");
              },
            });
          } else {
            window.location.href = result.redirectUrl;
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        setPaymentError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft, form, termsAccepted, clearDraft, navigate]
  );

  const handleWholesaleContinue = useCallback(async () => {
    if (!form.validateForm() || !termsAccepted || !draft) return;
    setIsSubmitting(true);
    setPaymentError(null);
    try {
      if (draft.source === "zentrumhub") {
        const { useBookingStore, useHotelStore } = await import("@/store");
        const booking = useBookingStore.getState();

        const priced = await booking.runPricing();
        if (!priced && useBookingStore.getState().status === "error") {
          setPaymentError(useBookingStore.getState().error ?? "Pricing failed");
          return;
        }

        const [firstName, ...rest] = form.values.fullName.trim().split(/\s+/);
        const lastName = rest.join(" ") || firstName;
        const guest = {
          type: "Adult",
          firstName,
          lastName,
          email: form.values.email,
          contactNumber: `${form.values.phoneCountryCode}${form.values.phoneNumber}`,
        };

        const roomId =
          draft.roomId ||
          useHotelStore.getState().selected?.roomId ||
          "";
        if (!roomId) {
          setPaymentError(
            "Missing roomId for this rate. Please go back and select the room again."
          );
          return;
        }

        const rateId = draft.rateIds?.[0] || useHotelStore.getState().selected?.rateIds?.[0];
        if (!rateId) {
          setPaymentError("Missing rateId. Please go back and select a rate again.");
          return;
        }

        const bookBody = {
          rateIds: draft.rateIds ?? [rateId],
          roomsAllocations: [
            {
              roomId,
              rateId,
              guests: [guest],
            },
          ],
          billingContact: guest,
          totalRate: useBookingStore.getState().price?.totalRate ?? draft.totalPrice ?? 0,
          loggedInUserEmail: form.values.email,
          guestNames: form.values.fullName,
          specialRequests: form.values.specialRequests
            ? [form.values.specialRequests]
            : undefined,
          travelPurpose: "Leisure" as const,
        };

        await booking.runBookInit(bookBody);
        const confirmation = await booking.runBook(bookBody);
        const bookingId =
          confirmation?.bookingId ||
          useBookingStore.getState().details?.bookingId ||
          useBookingStore.getState().hold?.bookingId;

        if (!bookingId) {
          setPaymentError(
            useBookingStore.getState().error ?? "Booking completed without an ID. Check Kibana logs."
          );
          return;
        }

        clearDraft();
        navigate(`/bookings/${bookingId}/confirmation`);
        return;
      }

      await new Promise((r) => setTimeout(r, 800));
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, form, termsAccepted, clearDraft, navigate]);

  const handleCtaClick = useCallback(() => {
    if (draft?.lane === "direct" && selectedMethod) {
      void handleSubmitPayment(selectedMethod);
    } else if (draft?.lane === "wholesale") {
      void handleWholesaleContinue();
    }
  }, [draft?.lane, selectedMethod, handleSubmitPayment, handleWholesaleContinue]);

  if (!draft) {
    return <NoActiveDraftState reason="missing" />;
  }

  const forceExpired = searchParams.get("expired") === "1";
  if (isExpired || holdExpired || forceExpired) {
    return <NoActiveDraftState reason="expired" />;
  }

  const handleContinueAsGuest = () => {
    sessionStorage.setItem(GUEST_CHECKOUT_KEY, "1");
    setGuestMode(true);
  };

  const showGuestPrompt = !isAuthenticated && !guestMode;

  const ctaLabel =
    draft.lane === "direct" ? `Pay ${payAmountLabel} now` : "Continue to complete booking";

  const supplierName = draft.hotelMeta?.name;

  return (
    <CheckoutLayout
      summary={
        <BookingSummaryCard
          draft={draft}
          onHoldExpire={handleHoldExpire}
          onDraftChange={saveDraft}
        />
      }
      stickyCta={
        showGuestPrompt ? undefined : (
        <CheckoutCTA
          label={ctaLabel}
          onClick={handleCtaClick}
          disabled={isActionDisabled}
          disabledReason={disabledReason}
          isLoading={isSubmitting}
        />
        )
      }
    >
      {showGuestPrompt ? (
        <GuestCheckoutPrompt onContinueAsGuest={handleContinueAsGuest} />
      ) : (
        <>
      {paymentError && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {paymentError}
        </div>
      )}

      <GuestDetailsForm
        values={form.values}
        errors={form.errors}
        touched={form.touched}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <PaymentSection
        lane={draft.lane}
        supplierName={supplierName}
        payAmountLabel={payAmountLabel}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        onSubmitPayment={handleSubmitPayment}
        onWholesaleContinue={handleWholesaleContinue}
        isSubmitting={isSubmitting}
        disabled={!termsAccepted || !form.isValid}
        disabledReason={disabledReason}
      />

      <CancellationPolicySummary lane={draft.lane} supplierName={supplierName} />

      <TermsAcceptance checked={termsAccepted} onChange={setTermsAccepted} />
        </>
      )}
    </CheckoutLayout>
  );
}
