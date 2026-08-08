import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Loader2 } from "lucide-react";
import { parseISO } from "date-fns";
import type { RestSlot } from "@/lib/booking/types";
import { supportsStayMode } from "@/lib/booking/availability";
import { usePropertyDetail } from "@/features/property/hooks/usePropertyDetail";
import { ImageGallery } from "@/features/property/components/ImageGallery";
import { PropertyInfoHeader } from "@/features/property/components/PropertyInfoHeader";
import { PropertyHighlights } from "@/features/property/components/PropertyHighlights";
import { BestPriceCard } from "@/features/property/components/BestPriceCard";
import { DetailTabs } from "@/features/property/components/DetailTabs";
import {
  MessagesContent,
  PoliciesContent,
  PropertyDetailsContent,
  ReviewsContent,
} from "@/features/property/components/PropertyTabContent";
import { BookingSidebar } from "@/features/property/components/BookingSidebar";
import { HotelInfoCard } from "@/features/property/components/HotelInfoCard";
import { RoomsRatesPanel } from "@/features/property/components/RoomsRatesPanel";
import { extractRatePolicies } from "@/features/property/utils/roomsRatesDisplay";
import type { DetailTab } from "@/features/property/types";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/CurrencyContext";
import { formatPrice } from "@/lib/currency/format";
import { toSupportedCurrency } from "@/lib/currency/pricing";
import {
  buildCheckoutDraft,
  saveCheckoutDraftToStorage,
} from "@/features/checkout";
import {
  useHotelStore,
  useFavoritesStore,
  type SelectedRateOption,
} from "@/store";

function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency } = useCurrency();
  const { property, isLoading, error, isZentrum } = usePropertyDetail(id);
  const selected = useHotelStore((s) => s.selected);
  const roomsRates = useHotelStore((s) => s.roomsRates);
  const selectRecommendation = useHotelStore((s) => s.selectRecommendation);
  const ratePolicies = extractRatePolicies(roomsRates);
  const isFavorite = useFavoritesStore((s) =>
    id ? Boolean(s.items[id]) : false,
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggle);

  const [activeTab, setActiveTab] = useState<DetailTab>("details");

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f7f7f8]">
        <Loader2 className="size-8 animate-spin text-brand" />
        <p className="text-sm text-muted-foreground">Loading hotel details…</p>
      </div>
    );
  }

  if (!property || error) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#f7f7f8]">
        <p className="text-lg font-semibold">{error ?? "Hotel not found"}</p>
        <Button asChild>
          <Link to="/search">Back to search</Link>
        </Button>
      </div>
    );
  }

  const rawMode = searchParams.get("mode") as "rest" | "stay" | null;
  const mode: "rest" | "stay" = isZentrum
    ? "stay"
    : property.lane === "wholesale"
      ? "stay"
      : property.slotDuration === "12h"
        ? "rest"
        : rawMode === "stay" && supportsStayMode(property)
          ? "stay"
          : "rest";

  const isDualMode =
    !isZentrum && property.lane === "direct" && property.slotDuration === "24h";

  const handleModeChange = (next: "rest" | "stay") => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("mode", next);
        return params;
      },
      { replace: true },
    );
  };

  const initialBooking = {
    checkIn: parseDateParam(searchParams.get("checkIn")),
    checkOut: parseDateParam(searchParams.get("checkOut")),
    restDate: parseDateParam(searchParams.get("restDate")),
    slot: (searchParams.get("slot") as RestSlot) ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
  };

  const selectedDisplayPrice = selected
    ? formatPrice(
        selected.totalRate,
        toSupportedCurrency(selected.currency || currency)
      )
    : null;

  const goToCheckout = (rate: SelectedRateOption) => {
    const draft = buildCheckoutDraft({
      propertyId: property.id,
      lane: "wholesale",
      mode: "stay",
      currency,
      hotelTimezone: property.timezone,
      guestsLabel: searchParams.get("guests") ?? "2 adults",
      checkIn: initialBooking.checkIn,
      checkOut: initialBooking.checkOut,
    });
    draft.source = "zentrumhub";
    draft.recommendationId = rate.recommendationId;
    draft.rateIds = rate.rateIds;
    draft.roomId = rate.roomId;
    draft.roomName = rate.roomName;
    draft.roomTypeLabel = rate.roomTypeLabel;
    draft.boardBasis = rate.boardBasis;
    draft.refundable = rate.refundable;
    draft.cancellationText = rate.cancellationText;
    draft.bedSummary = rate.bedSummary;
    draft.maxGuests = rate.maxGuests;
    draft.rooms = 1;
    draft.roomFacilities = rate.facilities;
    draft.roomImageUrl = rate.imageUrl;
    draft.totalPrice = rate.totalRate;
    draft.currency = (rate.currency as typeof draft.currency) || draft.currency;
    draft.hotelMeta = {
      name: property.title,
      address: property.address,
      city: property.city,
      country: property.country,
      imageUrl: property.image,
      starRating: property.starRating,
      rating: property.rating,
      reviewCount: property.reviewCount,
    };
    saveCheckoutDraftToStorage(draft);
    navigate("/checkout");
  };

  const handleReserve = (recommendationId: string) => {
    const rate = selectRecommendation(recommendationId);
    if (rate) goToCheckout(rate);
  };

  const handleTabChange = (tab: DetailTab) => {
    setActiveTab(tab);
    if (tab === "reviews") {
      requestAnimationFrame(() => scrollToId("hotel-reviews"));
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-7">
        <PropertyInfoHeader
          region={property.region}
          title={property.displayTitle || property.title}
          address={property.address || property.region}
          starRating={property.starRating}
          rating={property.rating}
          reviewCount={property.reviewCount}
          isSaved={isFavorite}
          onToggleSave={() => toggleFavorite(property)}
          onScrollToReviews={() => handleTabChange("reviews")}
        />

        {property.images.length > 0 ? (
          <div className="mt-5">
            <ImageGallery
              images={property.images}
              photoCount={property.photoCount}
              title={property.title}
            />
          </div>
        ) : null}

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="min-w-0 space-y-6">
            <PropertyHighlights
              items={property.highlights}
              amenities={property.detailAmenities}
              onShowMore={() => {
                setActiveTab("details");
                requestAnimationFrame(() => scrollToId("hotel-amenities"));
              }}
            />

            <DetailTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {activeTab === "details" && (
              <PropertyDetailsContent
                property={property}
                onViewReviews={() => handleTabChange("reviews")}
              />
            )}
            {activeTab === "policies" && (
              <PoliciesContent
                policies={property.policies}
                ratePolicies={isZentrum ? ratePolicies : undefined}
              />
            )}
            {activeTab === "reviews" && (
              <ReviewsContent
                reviews={property.reviews}
                rating={property.rating}
                reviewCount={property.reviewCount}
              />
            )}
            {activeTab === "messages" && <MessagesContent />}
          </div>

          <aside className="sticky top-24 space-y-4 self-start">
            {!isZentrum && (
              <BookingSidebar
                key={`${property.id}-${mode}`}
                propertyId={property.id}
                lane={property.lane}
                priceUsd={property.priceUsd}
                priceIdr={property.priceIdr}
                mode={mode}
                onModeChange={isDualMode ? handleModeChange : undefined}
                hotelTimezone={property.timezone}
                wholesalePricing={property.wholesalePricing}
                slotDuration={property.slotDuration}
                ringFencedRooms={property.ringFencedRooms}
                supplierName={property.supplierName}
                initialBooking={initialBooking}
              />
            )}
            {isZentrum && (
              <BestPriceCard
                roomName={selected?.roomName}
                roomTypeLabel={selected?.roomTypeLabel}
                boardBasis={selected?.boardBasis}
                refundable={selected?.refundable}
                maxGuests={selected?.maxGuests}
                bedSummary={selected?.bedSummary}
                imageUrl={selected?.imageUrl || property.image}
                includes={selected?.includes}
                views={selected?.views}
                areaLabel={selected?.areaLabel}
                priceLabel={selectedDisplayPrice}
                onScrollToRooms={() => {
                  setActiveTab("details");
                  requestAnimationFrame(() => scrollToId("hotel-rooms"));
                }}
              />
            )}
            <HotelInfoCard hotel={property.hotelInfo} lane={property.lane} />
          </aside>
        </div>

        {isZentrum && activeTab === "details" ? (
          <div className="mt-10 border-t border-border pt-8">
            <RoomsRatesPanel
              fallbackImage={property.image}
              onReserve={handleReserve}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
