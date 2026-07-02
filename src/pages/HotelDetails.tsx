import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { parseISO } from "date-fns";
import type { RestSlot } from "@/lib/booking/types";
import { supportsStayMode } from "@/lib/booking/availability";
import { getPropertyById } from "@/features/property/data";
import { ImageGallery } from "@/features/property/components/ImageGallery";
import { PropertyInfoHeader } from "@/features/property/components/PropertyInfoHeader";
import { DetailTabs } from "@/features/property/components/DetailTabs";
import {
  MessagesContent,
  PoliciesContent,
  PropertyDetailsContent,
  ReviewsContent,
} from "@/features/property/components/PropertyTabContent";
import { BookingSidebar } from "@/features/property/components/BookingSidebar";
import { HotelInfoCard } from "@/features/property/components/HotelInfoCard";
import { LocationMap } from "@/features/property/components/LocationMap";
import type { DetailTab } from "@/features/property/types";
import { Button } from "@/components/ui/button";

function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function HotelDetails() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const property = id ? getPropertyById(id) : null;

  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [isSaved, setIsSaved] = useState(false);

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <p className="text-lg font-semibold">Hotel not found</p>
        <Button asChild>
          <Link to="/search">Back to search</Link>
        </Button>
      </div>
    );
  }

  const rawMode = searchParams.get("mode") as "rest" | "stay" | null;
  const mode: "rest" | "stay" =
    property.lane === "wholesale"
      ? "stay"
      : property.slotDuration === "12h"
        ? "rest"
        : rawMode === "stay" && supportsStayMode(property)
          ? "stay"
          : "rest";

  const isDualMode = property.lane === "direct" && property.slotDuration === "24h";

  const handleModeChange = (next: "rest" | "stay") => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("mode", next);
        return params;
      },
      { replace: true }
    );
  };

  const initialBooking = {
    checkIn: parseDateParam(searchParams.get("checkIn")),
    checkOut: parseDateParam(searchParams.get("checkOut")),
    restDate: parseDateParam(searchParams.get("restDate")),
    slot: (searchParams.get("slot") as RestSlot) ?? undefined,
    guests: searchParams.get("guests") ?? undefined,
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <ImageGallery
          images={property.images}
          photoCount={property.photoCount}
          title={property.title}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <PropertyInfoHeader
              region={property.region}
              title={property.displayTitle}
              rating={property.rating}
              reviewCount={property.reviewCount}
              isSaved={isSaved}
              onToggleSave={() => setIsSaved((v) => !v)}
            />

            <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === "details" && (
              <>
                <PropertyDetailsContent property={property} />
                <LocationMap
                  mapImage={property.mapImage}
                  address={property.address}
                  distanceFromAirportKm={property.distanceFromAirportKm}
                />
              </>
            )}
            {activeTab === "policies" && (
              <PoliciesContent policies={property.policies} />
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

          <div className="sticky top-24 space-y-4 self-start">
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
            <HotelInfoCard hotel={property.hotelInfo} lane={property.lane} />
          </div>
        </div>
      </div>
    </div>
  );
}
