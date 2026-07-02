import {
  BadgeCheck,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  LayoutGrid,
  Plane,
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "../constants";

const ICONS = {
  "layout-grid": LayoutGrid,
  plane: Plane,
  "building-2": Building2,
  briefcase: Briefcase,
  clock: Clock,
  "badge-check": BadgeCheck,
} as const;

interface CategoryFilterBarProps {
  activeCategory: string;
  categoryCounts: Record<string, number>;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilterBar({
  activeCategory,
  categoryCounts,
  onCategoryChange,
}: CategoryFilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative mt-6 flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Scroll categories left"
        className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-foreground sm:flex"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={scrollRef}
        className="flex flex-1 gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((category) => {
          const Icon = ICONS[category.icon as keyof typeof ICONS];
          const count = categoryCounts[category.id];
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-white text-foreground hover:border-foreground/30"
              )}
            >
              <Icon className="size-4" />
              {category.label}
              {category.id !== "all" && count !== undefined ? ` (${count})` : ""}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Scroll categories right"
        className="hidden size-8 shrink-0 items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-foreground sm:flex"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
