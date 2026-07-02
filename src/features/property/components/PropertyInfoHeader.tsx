import { Heart, Share2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyInfoHeaderProps {
  region: string;
  title: string;
  rating: number;
  reviewCount: number;
  isSaved: boolean;
  onToggleSave: () => void;
}

export function PropertyInfoHeader({
  region,
  title,
  rating,
  reviewCount,
  isSaved,
  onToggleSave,
}: PropertyInfoHeaderProps) {
  return (
    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{region}</p>
        <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{rating}</span>
          <button type="button" className="text-muted-foreground underline underline-offset-2">
            {reviewCount} reviews
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        <button
          type="button"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-brand"
        >
          <Share2 className="size-4" />
          Share
        </button>
        <button
          type="button"
          onClick={onToggleSave}
          className="flex items-center gap-2 text-foreground transition-colors hover:text-brand"
        >
          <Heart className={cn("size-4", isSaved && "fill-red-500 text-red-500")} />
          Save
        </button>
      </div>
    </div>
  );
}
