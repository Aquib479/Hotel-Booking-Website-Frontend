import { useState } from "react";
import {
  Bath,
  Coffee,
  ConciergeBell,
  Dumbbell,
  MapPin,
  Maximize2,
  ParkingSquare,
  PawPrint,
  Sparkles,
  Sun,
  Utensils,
  Waves,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { Amenity, PropertyDetail, Review } from "../types";
import { iconForAmenityLabel } from "./PropertyHighlights";

const ICONS: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  maximize: Maximize2,
  sun: Sun,
  sparkles: Sparkles,
  paw: PawPrint,
  utensils: Utensils,
  wifi: Wifi,
  waves: Waves,
  pool: Waves,
  dumbbell: Dumbbell,
  parking: ParkingSquare,
  wind: Wind,
  coffee: Coffee,
  bath: Bath,
  concierge: ConciergeBell,
};

function amenityIcon(amenity: Amenity): LucideIcon {
  if (ICONS[amenity.icon]) return ICONS[amenity.icon];
  return iconForAmenityLabel(amenity.label);
}

function ratingLabel(rating: number) {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  if (rating > 0) return "Guest score";
  return null;
}

interface PropertyDetailsContentProps {
  property: PropertyDetail;
  onViewReviews?: () => void;
}

export function PropertyDetailsContent({
  property,
  onViewReviews,
}: PropertyDetailsContentProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const label = ratingLabel(property.rating);
  const snippet =
    property.reviews[0]?.comment ||
    property.highlights[0] ||
    "Guests love the location, cleanliness, and overall comfort.";

  const amenities = property.detailAmenities;
  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 8);

  return (
    <div className="space-y-8">
      {property.rating > 0 ? (
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
              {property.rating.toFixed(1)}
            </span>
            <div>
              <p className="font-semibold text-foreground">
                {label ?? "Guest rating"}
              </p>
              <button
                type="button"
                onClick={onViewReviews}
                className="text-sm text-brand hover:underline"
              >
                {property.reviewCount > 0
                  ? `All ${property.reviewCount.toLocaleString()} reviews`
                  : "See guest feedback"}
              </button>
            </div>
          </div>
          <p className="flex-1 text-sm leading-relaxed text-muted-foreground sm:border-l sm:border-border sm:pl-6">
            “{snippet}”
          </p>
        </section>
      ) : null}

      {property.highlights.length > 0 ? (
        <section>
          <h2 className="text-base font-semibold text-foreground">Highlights</h2>
          <div className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {property.highlights.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="hotel-amenities" className="scroll-mt-28">
        <h2 className="text-base font-semibold text-foreground">Amenities</h2>
        {amenities.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Amenities will appear when hotel content is available.
          </p>
        ) : (
          <>
            <div className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-2">
              {visibleAmenities.map((amenity) => (
                <AmenityItem key={amenity.label} amenity={amenity} />
              ))}
            </div>
            {amenities.length > 8 ? (
              <button
                type="button"
                onClick={() => setShowAllAmenities((v) => !v)}
                className="mt-3 text-sm font-medium text-brand hover:underline"
              >
                {showAllAmenities
                  ? "Show fewer amenities"
                  : `All amenities (${amenities.length})`}
              </button>
            ) : null}
          </>
        )}
      </section>

      {property.description ? (
        <section>
          <h2 className="text-base font-semibold text-foreground">About this property</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {property.description}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function AmenityItem({ amenity }: { amenity: Amenity }) {
  const Icon = amenityIcon(amenity);
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <Icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
      <span className="truncate">{amenity.label}</span>
    </div>
  );
}

export function PoliciesContent({ policies }: { policies: string[] }) {
  return (
    <div className="space-y-4 py-2">
      <h2 className="text-base font-semibold text-foreground">House rules & policies</h2>
      <ul className="space-y-2.5">
        {policies.map((policy) => (
          <li key={policy} className="flex gap-2.5 text-sm text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
            {policy}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewsContent({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}) {
  return (
    <div id="hotel-reviews" className="scroll-mt-28 space-y-6 py-2">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white">
          {rating.toFixed(1)}
        </span>
        <div>
          <p className="font-semibold text-foreground">
            {reviewCount > 0
              ? `${reviewCount.toLocaleString()} reviews`
              : "Guest reviews"}
          </p>
          <p className="text-sm text-muted-foreground">
            {ratingLabel(rating) ?? "What guests are saying"}
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            Detailed guest reviews will appear here when available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-border bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt=""
                  className="size-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {review.author}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function MessagesContent() {
  return (
    <div className="py-2">
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <p className="font-semibold text-foreground">Need help with this stay?</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact RestHalf support for booking questions, changes, or hotel help.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand transition hover:bg-brand/5"
        >
          Open support
        </button>
      </div>
    </div>
  );
}
