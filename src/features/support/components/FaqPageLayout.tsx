import { useMemo, useState } from "react";
import { FAQ_CATEGORIES, FAQ_ITEMS } from "../constants/faqContent";
import { useFaqSearch } from "../hooks/useFaqSearch";
import type { FaqCategoryId } from "../types";
import { FaqSearchBar } from "./FaqSearchBar";
import { FaqCategoryNav } from "./FaqCategoryNav";
import { FaqAccordionItem } from "./FaqAccordionItem";
import { FaqNoResultsState } from "./FaqNoResultsState";

export function FaqPageLayout() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | "all">("all");

  const searched = useFaqSearch(query);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return searched;
    return searched.filter((item) => item.category === activeCategory);
  }, [searched, activeCategory]);

  const counts = useMemo(() => {
    const base = query.trim() ? searched : FAQ_ITEMS;
    const map: Partial<Record<FaqCategoryId | "all", number>> = {
      all: base.length,
    };
    for (const cat of FAQ_CATEGORIES) {
      map[cat.id] = base.filter((i) => i.category === cat.id).length;
    }
    return map;
  }, [query, searched]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Help Center</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Half-day hotel booking is new to most travelers — search below or browse by topic.
        </p>
        <FaqSearchBar value={query} onChange={setQuery} className="mx-auto mt-8 max-w-xl" />
      </header>

      <div className="mt-8">
        <FaqCategoryNav
          categories={FAQ_CATEGORIES}
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
