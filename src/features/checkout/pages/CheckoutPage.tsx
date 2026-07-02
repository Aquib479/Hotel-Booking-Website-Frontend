import { useCallback, useMemo, useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { getPropertyById } from "@/features/property/data";
import { useBookingPricing } from "@/features/property/hooks/useBookingPricing";
import { useCheckoutDraft } from "../hooks/useCheckoutDraft";
import { useCheckoutForm } from "../hooks/useCheckoutForm";
import { parseDraftDates } from "../utils";
import type { PaymentMethod } from "../types";
import { CheckoutLayout } from "../components/CheckoutLayout";
import { BookingSummaryCard } from "../components/BookingSummaryCard";
import { GuestDetailsForm } from "../components/GuestDetailsForm";
import { PaymentSection } from "../components/PaymentSection";
import { CancellationPolicySummary } from "../components/CancellationPolicySummary";
import { TermsAcceptance } from "../components/TermsAcceptance";
import { CheckoutCTA } from "../components/CheckoutCTA";
import { NoActiveDraftState } from "../components/NoActiveDraftState";
import { usePaymentMethodSelection } from "../components/DirectPaymentMethods";

export function CheckoutPage() {
  const { draft, isExpired, clearDraft } = useCheckoutDraft();
  const { format: formatCurrency } = useCurrency();
  const form = useCheckoutForm();
  const { selectedMethod, setSelectedMethod } = usePaymentMethodSelection();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [holdExpired, setHoldExpired] = useState(false);

  const property = draft ? getPropertyById(draft.propertyId) : null;
  const dates = draft ? parseDraftDates(draft) : { restDate: undefined, checkIn: undefined, checkOut: undefined };

  const pricing = useBookingPricing(
    property?.lane ?? "direct",
    property?.priceUsd ?? 0,
    property?.priceIdr ?? 0,
    {
      mode: draft?.mode ?? "stay",
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
    },
    property?.wholesalePricing,
    property?.slotDuration ?? "12h"
  );

  const payAmountLabel = formatCurrency(pricing.totalDue);

  const disabledReason = useMemo(() => {
    if (!termsAccepted) return "Accept the terms to continue";
    if (!form.isValid) return "Fill in your details to continue";
    if (draft?.lane === "direct" && !selectedMethod) return "Select a payment method";
    return undefined;
  }, [termsAccepted, form.isValid, draft?.lane, selectedMethod]);

  const isActionDisabled = Boolean(disabledReason) || isSubmitting;

  const handleHoldExpire = useCallback(() => {
    setHoldExpired(true);
    clearDraft();
  }, [clearDraft]);

  const handleSubmitPayment = useCallback(
    async (method: PaymentMethod) => {
      if (!form.validateForm() || !termsAccepted || !draft) return;
      setIsSubmitting(true);
      try {
        // Backend: create Midtrans/Xendit payment intent and redirect
        await new Promise((r) => setTimeout(r, 800));
        console.info("onSubmitPayment", { method, draft, guest: form.values, phone: form.e164Phone });
      } finally {
        setIsSubmitting(false);
      }
    },
    [draft, form, termsAccepted]
  );

  const handleWholesaleContinue = useCallback(async () => {
    if (!form.validateForm() || !termsAccepted || !draft) return;
    setIsSubmitting(true);
    try {
      // Backend: hand off to TBO/Hotelbeds partner flow
      await new Promise((r) => setTimeout(r, 800));
      console.info("onWholesaleHandoff", { draft, guest: form.values });
    } finally {
      setIsSubmitting(false);
    }
  }, [draft, form, termsAccepted]);

  const handleCtaClick = useCallback(() => {
    if (draft?.lane === "direct" && selectedMethod) {
      void handleSubmitPayment(selectedMethod);
    } else if (draft?.lane === "wholesale") {
      void handleWholesaleContinue();
    }
  }, [draft?.lane, selectedMethod, handleSubmitPayment, handleWholesaleContinue]);

  if (!draft || !property) {
    return <NoActiveDraftState reason="missing" />;
  }

  if (isExpired || holdExpired) {
    return <NoActiveDraftState reason="expired" />;
  }

  const ctaLabel =
    draft.lane === "direct" ? `Pay ${payAmountLabel} now` : "Continue to complete booking";

  return (
    <CheckoutLayout
      summary={<BookingSummaryCard draft={draft} onHoldExpire={handleHoldExpire} />}
      stickyCta={
        <CheckoutCTA
          label={ctaLabel}
          onClick={handleCtaClick}
          disabled={isActionDisabled}
          disabledReason={disabledReason}
          isLoading={isSubmitting}
        />
      }
    >
      <GuestDetailsForm
        values={form.values}
        errors={form.errors}
        touched={form.touched}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
      />

      <PaymentSection
        lane={draft.lane}
        supplierName={property.supplierName}
        payAmountLabel={payAmountLabel}
        selectedMethod={selectedMethod}
        onSelectMethod={setSelectedMethod}
        onSubmitPayment={handleSubmitPayment}
        onWholesaleContinue={handleWholesaleContinue}
        isSubmitting={isSubmitting}
        disabled={!termsAccepted || !form.isValid}
        disabledReason={disabledReason}
      />

      <CancellationPolicySummary lane={draft.lane} supplierName={property.supplierName} />

      <TermsAcceptance checked={termsAccepted} onChange={setTermsAccepted} />

      {/* Desktop CTA is inside PaymentSection; mobile uses sticky CheckoutCTA */}
    </CheckoutLayout>
  );
}
