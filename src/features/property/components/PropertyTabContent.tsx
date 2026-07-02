import {
  MapPin,
  Maximize2,
  PawPrint,
  Sparkles,
  Sun,
  Utensils,
} from "lucide-react";
import type { Amenity, PropertyDetail, Review } from "../types";

const ICONS = {
  "map-pin": MapPin,
  maximize: Maximize2,
  sun: Sun,
  sparkles: Sparkles,
  paw: PawPrint,
  utensils: Utensils,
} as const;

interface PropertyDetailsContentProps {
  property: PropertyDetail;
}

export function PropertyDetailsContent({ property }: PropertyDetailsContentProps) {
  return (
    <div className="space-y-10 py-8">
      <section>
        <h2 className="text-lg font-semibold text-foreground">Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {property.description}
        </p>
        <ul className="mt-4 space-y-2">
          {property.highlights.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-foreground">
              <span className="text-brand">•</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">What this place offers?</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {property.amenities.map((amenity) => (
            <AmenityItem key={amenity.label} amenity={amenity} />
          ))}
        </div>
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        {property.images.slice(0, 3).map((image) => (
          <img
            key={image}
            src={image}
            alt=""
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ))}
      </section>
    </div>
  );
}

function AmenityItem({ amenity }: { amenity: Amenity }) {
  const Icon = ICONS[amenity.icon as keyof typeof ICONS] ?? Sparkles;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
      <Icon className="size-5 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{amenity.label}</span>
    </div>
  );
}

export function PoliciesContent({ policies }: { policies: string[] }) {
  return (
    <div className="space-y-4 py-8">
      <h2 className="text-lg font-semibold text-foreground">House rules & policies</h2>
      <ul className="space-y-3">
        {policies.map((policy) => (
          <li key={policy} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-brand">•</span>
            {policy}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewsContent({ reviews, rating, reviewCount }: { reviews: Review[]; rating: number; reviewCount: number }) {
  return (
    <div className="space-y-6 py-8">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-foreground">{rating}</span>
        <div>
          <p className="font-semibold text-foreground">{reviewCount} reviews</p>
          <p className="text-sm text-muted-foreground">Guest favorite</p>
        </div>
      </div>
      <div className="space-y-6">
        {reviews.map((review) => (
          <article key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center gap-3">
              <img src={review.avatar} alt="" className="size-10 rounded-full object-cover" />
              <div>
                <p className="text-sm font-semibold text-foreground">{review.author}</p>
                <p className="text-xs text-muted-foreground">{review.date}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function MessagesContent() {
  return (
    <div className="py-8">
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
        <p className="font-semibold text-foreground">2 unread messages</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact the host to ask questions about this property before booking.
        </p>
        <button
          type="button"
          className="mt-4 rounded-full border border-brand px-5 py-2 text-sm font-medium text-brand hover:bg-brand/5"
        >
          Open messages
        </button>
      </div>
    </div>
  );
}
