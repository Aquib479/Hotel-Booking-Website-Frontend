import { FilterPillGroup } from "@/components/common/FilterPillGroup";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const options = [
    { id: "all" as const, label: t("support.faqAll"), count: counts?.all },
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
      aria-label={t("support.faqCategories")}
    />
  );
}
