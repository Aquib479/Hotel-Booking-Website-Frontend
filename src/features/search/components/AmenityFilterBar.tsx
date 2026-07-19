import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { AMENITY_FILTER_OPTIONS } from "../constants";
import type { AmenityFilter } from "@/lib/booking/types";

interface AmenityFilterBarProps {
  selectedAmenities: AmenityFilter[];
  onToggleAmenity: (amenity: AmenityFilter) => void;
}

export function AmenityFilterBar({
  selectedAmenities,
  onToggleAmenity,
}: AmenityFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative mt-6 flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll amenities left"
        className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-foreground sm:flex"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {AMENITY_FILTER_OPTIONS.map((amenity) => {
          const isActive = selectedAmenities.includes(amenity);

          return (
            <button
              key={amenity}
              type="button"
              onClick={() => onToggleAmenity(amenity)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-white text-foreground hover:border-foreground/30"
              )}
            >
              {amenity}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll amenities right"
        className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-foreground sm:flex"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
