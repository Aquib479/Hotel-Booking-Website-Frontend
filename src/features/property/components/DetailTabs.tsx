import { cn } from "@/lib/utils";
import { DETAIL_TABS } from "../data";
import type { DetailTab } from "../types";

interface DetailTabsProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
}

export function DetailTabs({ activeTab, onTabChange }: DetailTabsProps) {
  return (
    <div className="mt-8 border-b border-border">
      <div className="flex gap-6 overflow-x-auto">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative shrink-0 pb-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-foreground" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
