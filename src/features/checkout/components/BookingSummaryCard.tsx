import { Link } from "react-router-dom";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { CheckoutDraft } from "../types";
import { formatGuestsSummary, draftToDetailSearchParams } from "../utils";
import { HotelSummaryHeader } from "./HotelSummaryHeader";
import { DateOrSlotSummary } from "./DateOrSlotSummary";
import { SlotHoldCountdown } from "./SlotHoldCountdown";

interface BookingSummaryCardProps {
  draft: CheckoutDraft;
  onHoldExpire: () => void;
}

export function BookingSummaryCard({ draft, onHoldExpire }: BookingSummaryCardProps) {
  const { format: formatCurrency } = useCurrency();

  const hotelName = draft.hotelMeta?.name ?? "Hotel";
  const hotelImage = draft.hotelMeta?.imageUrl ?? "";
  const hotelLocation = draft.hotelMeta
    ? [draft.hotelMeta.city, draft.hotelMeta.country].filter(Boolean).join(", ") || draft.hotelMeta.address
    : "";
  const starRating = draft.hotelMeta?.starRating ?? 4;

  const editParams = draftToDetailSearchParams(draft);

  const displayPrice = draft.totalPrice ?? 0;

  return (
    <Card padding="none">
      <CardContent className="space-y-0 p-0 sm:p-0">
        <HotelSummaryHeader
          imageUrl={hotelImage}
          name={hotelName}
          location={hotelLocation}
          starRating={starRating}
          lane={draft.lane}
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
            {displayPrice > 0 && (
              <>
                <div className="flex justify-between pt-1 font-bold text-foreground">
                  <span>Total due</span>
                  <span>{formatCurrency(displayPrice)}</span>
                </div>
              </>
            )}
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
