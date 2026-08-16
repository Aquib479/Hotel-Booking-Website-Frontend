import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { saveCardFromPayment } from "@/features/account/lib/saveCard";
import { Button } from "@/components/ui/button";
import { confirmBooking, releaseBooking as releaseBookingHold } from "../api";
import { useCheckoutCurrencyReprice } from "../hooks/useCheckoutCurrencyReprice";
import { useCheckoutDraft } from "../hooks/useCheckoutDraft";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import type {
  CheckoutDraft,
  CheckoutStep,
  ConfirmedCheckoutSnapshot,
  GuestDetailsValues,
  PaymentMethod,
} from "../types";
import { CheckoutLayout } from "../components/CheckoutLayout";
import { CheckoutStepIndicator } from "../components/CheckoutStepIndicator";
import { CheckoutConfirmed } from "../components/CheckoutConfirmed";
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

function buildConfirmedSnapshot(
  draft: CheckoutDraft,
  guest: GuestDetailsValues,
  bookingId: string,
  confirmationCode?: string
): ConfirmedCheckoutSnapshot {
  return {
    bookingId,
    confirmationCode,
    hotelName: draft.hotelMeta?.name ?? "Your booking",
    hotelImageUrl: draft.hotelMeta?.imageUrl || draft.roomImageUrl || undefined,
    mode: draft.mode,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    nights: draft.nights,
    slotDate: draft.slotDate,
    slotWindow: draft.slotWindow,
    guestsLabel: draft.guestsLabel,
    roomName: draft.roomName,
    totalPrice: draft.totalPrice ?? 0,
    currency: toCurrencyCode(draft.currency),
    guestName: guest.fullName.trim(),
    guestEmail: guest.email.trim(),
  };
}

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const { currency } = useCurrency();
  const { draft, isExpired, clearDraft, saveDraft } = useCheckoutDraft();
  const { isRefreshingPrice, priceRefreshError } = useCheckoutCurrencyReprice(
    draft,
    saveDraft
  );
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
  const {
    selectedMethod,
    setSelectedMethod,
    cardForm,
    upiForm,
    isPaymentDetailsValid,
    validatePaymentDetails,
  } = usePaymentMethodSelection();

  const [step, setStep] = useState<CheckoutStep>(1);
  const [confirmed, setConfirmed] = useState<ConfirmedCheckoutSnapshot | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [guestMode, setGuestMode] = useState(() => readGuestMode() || isAuthenticated);

  const draftCurrency = toCurrencyCode(draft?.currency);
  const totalPrice =
    draft?.totalPrice != null && draft.totalPrice > 0 ? draft.totalPrice : 0;
  const payAmountLabel = formatPrice(totalPrice, draftCurrency);

  const step1DisabledReason = useMemo(() => {
    if (!form.isValid) return "Fill in your details to continue";
    return undefined;
  }, [form.isValid]);

  const step2DisabledReason = useMemo(() => {
    if (isRefreshingPrice) return "Updating price for selected currency…";
    if (!termsAccepted) return "Accept the terms to continue";
    if (!form.isValid) return "Fill in your details to continue";
    if (!selectedMethod) return "Select a payment method";
    if (!isPaymentDetailsValid) {
      return selectedMethod === "upi"
        ? "Enter a valid UPI ID to continue"
        : "Enter valid card details to continue";
    }
    return undefined;
  }, [
    isRefreshingPrice,
    termsAccepted,
    form.isValid,
    selectedMethod,
    isPaymentDetailsValid,
  ]);

  const handleHoldExpire = useCallback(() => {
    if (draft?.bookingId) {
      void releaseBookingHold(draft.bookingId);
    }
    setHoldExpired(true);
    clearDraft();
  }, [clearDraft, draft?.bookingId]);

  const finishConfirmed = useCallback(
    (bookingId: string, confirmationCode?: string) => {
      if (!draft) return;
      const snapshot = buildConfirmedSnapshot(
        draft,
        form.values,
        bookingId,
        confirmationCode
      );
      clearDraft();
      setConfirmed(snapshot);
      setStep(3);
    },
    [clearDraft, draft, form.values]
  );

  const persistCardIfNeeded = useCallback(
    async (method: PaymentMethod) => {
      if (method !== "card" || !user) return;
      try {
        await saveCardFromPayment(user.id, {
          cardNumber: cardForm.values.cardNumber,
          expiry: cardForm.values.expiry,
          holderName: cardForm.values.holderName,
        });
      } catch {
        /* saving card must not block checkout confirmation */
      }
    },
    [user, cardForm.values.cardNumber, cardForm.values.expiry, cardForm.values.holderName]
  );

  const handleSubmitPayment = useCallback(
    async (method: PaymentMethod) => {
      if (!form.validateForm() || !termsAccepted || !draft) return;
      if (!validatePaymentDetails()) return;
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
            draft.roomId || useHotelStore.getState().selected?.roomId || "";
          if (!roomId) {
            setPaymentError(
              "Missing roomId for this rate. Please go back and select the room again."
            );
            return;
          }

          const rateId =
            draft.rateIds?.[0] || useHotelStore.getState().selected?.rateIds?.[0];
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
              useBookingStore.getState().error ??
                "Booking completed without an ID. Check Kibana logs."
            );
            return;
          }

          await persistCardIfNeeded(method);
          finishConfirmed(
            bookingId,
            confirmation?.hotelConfirmationNumber ||
              confirmation?.providerConfirmationNumber ||
              undefined
          );
          return;
        }

        if (!draft.bookingId) {
          setPaymentError("No active booking hold. Please go back and try again.");
          return;
        }

        const result = await confirmBooking(draft.bookingId);

        if (result.redirectUrl) {
          await persistCardIfNeeded(method);
          window.location.href = result.redirectUrl;
        } else if (result.snapToken) {
          const snap = (window as unknown as Record<string, unknown>).snap as
            | { pay: (token: string, opts: Record<string, unknown>) => void }
            | undefined;
          if (snap) {
            snap.pay(result.snapToken, {
              onSuccess: () => {
                void persistCardIfNeeded(method).then(() =>
                  finishConfirmed(draft.bookingId!)
                );
              },
              onPending: () => {
                void persistCardIfNeeded(method).then(() =>
                  finishConfirmed(draft.bookingId!)
                );
              },
              onError: () => {
                setPaymentError("Payment failed. Please try again.");
              },
              onClose: () => {
                setPaymentError(
                  "Payment window closed. You can try again before the hold expires."
                );
              },
            });
          } else if (result.redirectUrl) {
            await persistCardIfNeeded(method);
            window.location.href = result.redirectUrl;
          } else {
            setPaymentError("Payment gateway is unavailable. Please try again.");
          }
        } else {
          await persistCardIfNeeded(method);
          finishConfirmed(draft.bookingId);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed";
        setPaymentError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      draft,
      form,
      termsAccepted,
      finishConfirmed,
      validatePaymentDetails,
      persistCardIfNeeded,
    ]
  );

  const handleContinueToPayment = useCallback(() => {
    if (!form.validateForm()) return;
    setPaymentError(null);
    setStep(2);
  }, [form]);

  const handleBackToCustomer = useCallback(() => {
    setPaymentError(null);
    setStep(1);
  }, []);

  const handleCtaClick = useCallback(() => {
    if (step === 1) {
      handleContinueToPayment();
      return;
    }
    if (step === 2 && selectedMethod) {
      void handleSubmitPayment(selectedMethod);
    }
  }, [step, selectedMethod, handleContinueToPayment, handleSubmitPayment]);

  if (confirmed && step === 3) {
    return (
      <CheckoutLayout confirmed title="Checkout">
        <CheckoutStepIndicator current={3} />
        <CheckoutConfirmed snapshot={confirmed} />
      </CheckoutLayout>
    );
  }

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
  const supplierName = draft.hotelMeta?.name;

  const ctaLabel =
    step === 1 ? "Continue to payment" : `Pay ${payAmountLabel} now`;
  const disabledReason = step === 1 ? step1DisabledReason : step2DisabledReason;
  const isActionDisabled =
    Boolean(disabledReason) ||
    isSubmitting ||
    (step === 2 && isRefreshingPrice);

  const summary = (
    <BookingSummaryCard
      draft={draft}
      onHoldExpire={handleHoldExpire}
      onDraftChange={saveDraft}
      isRefreshingPrice={isRefreshingPrice}
    />
  );

  return (
    <CheckoutLayout
      summary={summary}
      stickyCta={
        showGuestPrompt ? undefined : (
          <CheckoutCTA
            label={ctaLabel}
            onClick={handleCtaClick}
            disabled={isActionDisabled}
            disabledReason={disabledReason}
            isLoading={isSubmitting || (step === 2 && isRefreshingPrice)}
          />
        )
      }
    >
      {showGuestPrompt ? (
        <GuestCheckoutPrompt onContinueAsGuest={handleContinueAsGuest} />
      ) : (
        <>
          <CheckoutStepIndicator current={step} />

          {(paymentError || priceRefreshError) && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {paymentError || priceRefreshError}
            </div>
          )}

          {isRefreshingPrice ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-brand" />
              Updating price for {currency}…
            </div>
          ) : null}

          {step === 1 && (
            <>
              <GuestDetailsForm
                values={form.values}
                errors={form.errors}
                touched={form.touched}
                onChange={form.handleChange}
                onBlur={form.handleBlur}
              />
              <div className="hidden lg:block">
                <CheckoutCTA
                  label={ctaLabel}
                  onClick={handleCtaClick}
                  disabled={isActionDisabled}
                  disabledReason={disabledReason}
                  isLoading={false}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleBackToCustomer}
                className="-mt-2 w-fit gap-1 px-0 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
                Back to customer information
              </Button>

              <PaymentSection
                payAmountLabel={payAmountLabel}
                selectedMethod={selectedMethod}
                onSelectMethod={setSelectedMethod}
                onSubmitPayment={handleSubmitPayment}
                isSubmitting={isSubmitting || isRefreshingPrice}
                disabled={
                  !termsAccepted ||
                  !form.isValid ||
                  isRefreshingPrice ||
                  !isPaymentDetailsValid
                }
                disabledReason={disabledReason}
                showSubmitButton={false}
                cardForm={cardForm}
                upiForm={upiForm}
              />

              <CancellationPolicySummary lane={draft.lane} supplierName={supplierName} />

              <TermsAcceptance checked={termsAccepted} onChange={setTermsAccepted} />

              <div className="hidden lg:block">
                <CheckoutCTA
                  label={ctaLabel}
                  onClick={handleCtaClick}
                  disabled={isActionDisabled}
                  disabledReason={disabledReason}
                  isLoading={isSubmitting || isRefreshingPrice}
                />
              </div>
            </>
          )}
        </>
      )}
    </CheckoutLayout>
  );
}
