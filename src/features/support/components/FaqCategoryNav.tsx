import { FilterPillGroup } from "@/components/common/FilterPillGroup";
import type { FaqCategory, FaqCategoryId } from "../types";

interface FaqCategoryNavProps {
  categories: FaqCategory[];
  activeCategory: FaqCategoryId | "all";
  onSelect: (category: FaqCategoryId | "all") => void;
  counts?: Partial<Record<FaqCategoryId | "all", number>>;
}

export function FaqCategoryNav({
  categories,
  activeCategory,
  onSelect,
  counts,
}: FaqCategoryNavProps) {
  const options = [
    { id: "all" as const, label: "All", count: counts?.all },
    ...categories.map((c) => ({
      id: c.id,
      label: c.label,
      count: counts?.[c.id],
    })),
  ];

  return (
    <FilterPillGroup
      options={options}
      value={activeCategory}
      onChange={onSelect}
      aria-label="FAQ categories"
    />
  );
}
