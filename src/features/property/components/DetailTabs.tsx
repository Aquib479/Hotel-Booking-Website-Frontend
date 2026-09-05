import { cn } from "@/lib/utils";
import { DETAIL_TABS } from "../data";
import type { DetailTab } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface DetailTabsProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}

export function DetailTabs({ activeTab, onTabChange }: DetailTabsProps) {
  const { t } = useLanguage();
  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border/80 bg-[#fafafa]/95 px-4 backdrop-blur-md sm:-mx-0 sm:px-0">
      <div className="flex justify-between gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition",
              activeTab === tab.id
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:bg-white hover:text-foreground"
            )}
          >
            {t(`hotel.tab.${tab.id}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
