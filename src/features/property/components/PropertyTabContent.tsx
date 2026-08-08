import { useState } from "react";
import {
  BadgeCheck,
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
import { cn } from "@/lib/utils";

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

export function PoliciesContent({
  policies,
  ratePolicies,
}: {
  policies: string[] | Array<{ type: string; text: string }>;
  /** Rich policies from rooms/rates when available (Zentrum). */
  ratePolicies?: Array<{ type: string; text: string }>;
}) {
  const structured =
    ratePolicies?.length
      ? ratePolicies
      : policies.every((p) => typeof p === "object" && p && "text" in p)
        ? (policies as Array<{ type: string; text: string }>)
        : null;

  if (structured?.length) {
    return (
      <div className="space-y-5 py-2">
        <h2 className="text-base font-semibold text-foreground">
          House rules & policies
        </h2>
        <div className="space-y-4">
          {structured.map((policy) => (
            <section
              key={policy.type}
              className="rounded-md border border-border bg-white p-4"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {policy.type}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {policy.text}
              </p>
            </section>
          ))}
        </div>
      </div>
    );
  }

  const plain = policies.map((p) =>
    typeof p === "string" ? p : `${p.type}: ${p.text}`,
  );

  return (
    <div className="space-y-4 py-2">
      <h2 className="text-base font-semibold text-foreground">House rules & policies</h2>
      <ul className="space-y-2.5">
        {plain.map((policy) => (
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
  const label = ratingLabel(rating);
  const shownCount = reviewCount > 0 ? reviewCount : reviews.length;

  return (
    <div id="hotel-reviews" className="scroll-mt-28 space-y-6 py-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-14 items-center justify-center rounded-xl bg-brand text-xl font-bold text-white">
            {rating > 0 ? rating.toFixed(1) : "—"}
          </span>
          <div>
            <p className="font-semibold text-foreground">
              {label ?? "Guest reviews"}
            </p>
            <p className="text-sm text-muted-foreground">
              {shownCount > 0
                ? `${shownCount.toLocaleString()} verified guest reviews`
                : "What guests are saying"}
            </p>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            {reviewCount > 0
              ? "Individual guest comments are not available for this property yet."
              : "Detailed guest reviews will appear here when available."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <GuestReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}

function scoreTone(score: number) {
  if (score >= 9) return "bg-emerald-600 text-white";
  if (score >= 7) return "bg-brand text-white";
  if (score >= 5) return "bg-amber-500 text-white";
  if (score > 0) return "bg-orange-500 text-white";
  return "bg-muted text-muted-foreground";
}

function GuestReviewCard({ review }: { review: Review }) {
  const meta = [
    review.travelerType,
    review.travelPurpose,
    review.country,
  ].filter(Boolean);

  const bodyParagraphs =
    review.paragraphs?.length
      ? review.paragraphs
      : review.comment
        ? [review.comment]
        : [];

  return (
    <article className="rounded-md border border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-semibold text-brand">
            {review.author.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {review.author}
            </p>
            {meta.length > 0 ? (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {meta.join(" · ")}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>

        {review.rating > 0 ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums",
              scoreTone(review.rating),
            )}
          >
            {Number.isInteger(review.rating)
              ? review.rating
              : review.rating.toFixed(1)}
          </span>
        ) : null}
      </div>

      {review.source ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
          <BadgeCheck className="size-3.5" />
          Verified · {review.source}
        </p>
      ) : null}

      {review.title ? (
        <h3 className="mt-3 text-base font-semibold text-foreground">
          {review.title}
        </h3>
      ) : null}

      {review.summary ? (
        <p className="mt-2 text-sm italic leading-relaxed text-muted-foreground">
          {review.summary}
        </p>
      ) : null}

      {bodyParagraphs.length > 0 ? (
        <div className="mt-3 space-y-2.5">
          {bodyParagraphs.map((paragraph, index) => (
            <p
              key={`${review.id}-p-${index}`}
              className="text-sm leading-relaxed text-foreground/90"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {review.managementResponses?.length ? (
        <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
          {review.managementResponses.map((response, index) => (
            <div
              key={`${review.id}-mgmt-${index}`}
              className="rounded-xl bg-muted/40 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Response from property
                {response.date ? ` · ${response.date}` : ""}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                {response.text}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function MessagesContent() {
  return (
    <div className="py-2">
      <div className="rounded-md border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
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
