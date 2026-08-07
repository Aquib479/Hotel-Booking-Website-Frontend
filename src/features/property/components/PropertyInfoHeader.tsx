import { Heart, MapPin, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyInfoHeaderProps {
  region: string;
  title: string;
  address?: string;
  starRating?: number;
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  onToggleSave: () => void;
  onShare?: () => void;
  onScrollToReviews?: () => void;
}

function ratingLabel(rating: number) {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  if (rating > 0) return "Guest score";
  return null;
}

export function PropertyInfoHeader({
  region,
  title,
  address,
  starRating = 0,
  rating,
  reviewCount,
  isSaved,
  onToggleSave,
  onShare,
  onScrollToReviews,
}: PropertyInfoHeaderProps) {
  const label = ratingLabel(rating);

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore cancel / clipboard failures */
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {starRating > 0 ? (
            <span
              className="inline-flex items-center gap-0.5"
              aria-label={`${starRating} star hotel`}
            >
              {Array.from({ length: Math.min(5, starRating) }).map((_, i) => (
                <Star
                  key={i}
                  className="size-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </span>
          ) : null}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
          {(address || region) && (
            <p className="flex items-start gap-1.5 text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              <span className="line-clamp-2">{address || region}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm transition hover:border-brand/30 hover:text-brand"
        >
          <Share2 className="size-4" />
          Share
        </button>
        <button
          type="button"
          onClick={onToggleSave}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium shadow-sm transition",
            isSaved
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-border bg-white text-foreground hover:border-brand/30 hover:text-brand",
          )}
        >
          <Heart
            className={cn("size-4", isSaved && "fill-red-500 text-red-500")}
          />
          {isSaved ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
