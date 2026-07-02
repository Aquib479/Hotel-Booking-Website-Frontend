import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { parseISO } from "date-fns";
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
import { HostCard } from "@/features/property/components/HostCard";
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
  const [searchParams] = useSearchParams();
  const property = id ? getPropertyById(id) : null;

  const [activeTab, setActiveTab] = useState<DetailTab>("details");
  const [isSaved, setIsSaved] = useState(false);

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fafafa]">
        <p className="text-lg font-semibold">Property not found</p>
        <Button asChild>
          <Link to="/search">Back to search</Link>
        </Button>
      </div>
    );
  }

  const initialBooking = {
    checkIn: parseDateParam(searchParams.get("checkIn")),
    checkOut: parseDateParam(searchParams.get("checkOut")),
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
                  host={property.host}
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
              propertyId={property.id}
              pricePerNight={property.pricePerNight}
              initialBooking={initialBooking}
            />
            <HostCard host={property.host} />
          </div>
        </div>
      </div>
    </div>
  );
}
