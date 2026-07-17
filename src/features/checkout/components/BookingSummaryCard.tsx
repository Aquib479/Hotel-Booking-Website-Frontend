import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { useBookingPricing } from "@/features/property/hooks/useBookingPricing";
import { getPropertyById } from "@/features/property/data";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
    <Card padding="none">
      <CardContent className="space-y-0 p-0 sm:p-0">
        <HotelSummaryHeader
          imageUrl={property.image}
          name={property.title}
          location={property.address}
          starRating={property.starRating}
          lane={property.lane}
        />

        <Separator />

        <div className="space-y-4 p-4 sm:p-5">
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

          <Separator />

          <div className="space-y-2 text-sm">
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
            <Separator />
            <div className="flex justify-between pt-1 font-bold text-foreground">
              <span>Total due</span>
              <span>{formatCurrency(pricing.totalDue)}</span>
            </div>
          </div>

          <Button variant="link" className="h-auto w-full p-0" asChild>
            <Link to={`/properties/${draft.propertyId}?${editParams.toString()}`}>
              Edit details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
