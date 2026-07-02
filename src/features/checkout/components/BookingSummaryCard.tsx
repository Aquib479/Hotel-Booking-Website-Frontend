import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { useBookingPricing } from "@/features/property/hooks/useBookingPricing";
import { getPropertyById } from "@/features/property/data";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import type { CheckoutDraft } from "../types";
import { formatGuestsSummary, draftToDetailSearchParams, parseDraftDates } from "../utils";
import { HotelSummaryHeader } from "./HotelSummaryHeader";
import { DateOrSlotSummary } from "./DateOrSlotSummary";
import { SlotHoldCountdown } from "./SlotHoldCountdown";

interface BookingSummaryCardProps {
  draft: CheckoutDraft;
  onHoldExpire: () => void;
}

export function BookingSummaryCard({ draft, onHoldExpire }: BookingSummaryCardProps) {
  const { format: formatCurrency } = useCurrency();
  const property = getPropertyById(draft.propertyId);
  const dates = parseDraftDates(draft);

  if (!property) return null;

  const pricing = useBookingPricing(
    property.lane,
    property.priceUsd,
    property.priceIdr,
    {
      mode: draft.mode,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
    },
    property.wholesalePricing,
    property.slotDuration
  );

  const editParams = draftToDetailSearchParams(draft);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
      <HotelSummaryHeader
        imageUrl={property.image}
        name={property.title}
        location={property.address}
        starRating={property.starRating}
        lane={property.lane}
      />

      <DateOrSlotSummary
        mode={draft.mode}
        slotDate={draft.slotDate}
        slotWindow={draft.slotWindow}
        checkIn={draft.checkIn}
        checkOut={draft.checkOut}
        nights={draft.nights}
      />

      <p className="text-sm text-muted-foreground">
        Guests: {formatGuestsSummary(draft.guests)}
      </p>

      {draft.lane === "direct" && draft.holdExpiresAt && (
        <SlotHoldCountdown holdExpiresAt={draft.holdExpiresAt} onExpire={onHoldExpire} />
      )}

      <div className="space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-baseline justify-between">
          <PriceDisplay
            lane={property.lane}
            priceUsd={property.priceUsd}
            priceIdr={property.priceIdr}
            wholesalePricing={property.wholesalePricing}
            mode={draft.mode}
            slotDuration={property.slotDuration}
          />
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>
            {pricing.label}
            {draft.mode === "stay" && pricing.nights > 1 && ` × ${pricing.nights} nights`}
          </span>
          <span>{formatCurrency(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxes & fees</span>
          <span>{formatCurrency(pricing.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground">
          <span>Total due</span>
          <span>{formatCurrency(pricing.totalDue)}</span>
        </div>
      </div>

      <Link
        to={`/properties/${draft.propertyId}?${editParams.toString()}`}
        className="block text-center text-sm font-medium text-brand hover:text-brand/80"
      >
        Edit details
      </Link>
    </div>
  );
}
