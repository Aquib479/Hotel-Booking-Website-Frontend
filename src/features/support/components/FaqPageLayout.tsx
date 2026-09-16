import { useMemo, useState } from "react";
import { getFaqCategories, getFaqItems } from "../constants/faqContent";
import { useFaqSearch } from "../hooks/useFaqSearch";
import type { FaqCategoryId } from "../types";
import { FaqSearchBar } from "./FaqSearchBar";
import { FaqCategoryNav } from "./FaqCategoryNav";
import { FaqAccordionItem } from "./FaqAccordionItem";
import { FaqNoResultsState } from "./FaqNoResultsState";
import { useLanguage } from "@/context/LanguageContext";

export function FaqPageLayout() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | "all">("all");

  const categories = useMemo(() => getFaqCategories(language), [language]);
  const items = useMemo(() => getFaqItems(language), [language]);
  const searched = useFaqSearch(query, items);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return searched;
    return searched.filter((item) => item.category === activeCategory);
  }, [searched, activeCategory]);

  const counts = useMemo(() => {
    const base = query.trim() ? searched : items;
    const map: Partial<Record<FaqCategoryId | "all", number>> = {
      all: base.length,
    };
    for (const cat of categories) {
      map[cat.id] = base.filter((i) => i.category === cat.id).length;
    }
    return map;
  }, [query, searched, items, categories]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("support.help")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("support.helpHint")}</p>
        <FaqSearchBar value={query} onChange={setQuery} className="mx-auto mt-8 max-w-xl" />
      </header>

      <div className="mt-8">
        <FaqCategoryNav
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          counts={counts}
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <FaqNoResultsState query={query} />
        ) : (
          filtered.map((item, index) => (
            <FaqAccordionItem key={item.id} item={item} defaultOpen={index === 0 && !!query.trim()} />
          ))
        )}
      </div>
    </div>
  );
}
