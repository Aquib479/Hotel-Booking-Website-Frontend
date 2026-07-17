import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LegalSection } from "../types";

export function flattenLegalSections(
  sections: LegalSection[]
): { id: string; title: string; depth: number }[] {
  const result: { id: string; title: string; depth: number }[] = [];

  function walk(list: LegalSection[], depth: number) {
    for (const section of list) {
      result.push({ id: section.id, title: section.title, depth });
      if (section.subsections) walk(section.subsections, depth + 1);
    }
  }

  walk(sections, 0);
  return result;
}

interface LegalTableOfContentsProps {
  sections: LegalSection[];
}

export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = flattenLegalSections(sections);

  const handleClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  const list = (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => handleClick(item.id)}
            className={cn(
              "w-full rounded-lg px-2 py-1.5 text-left text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground",
              item.depth > 0 && "pl-4 text-xs"
            )}
          >
            {item.title}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium"
        >
          On this page
          <ChevronDown className={cn("size-4 transition-transform", mobileOpen && "rotate-180")} />
        </button>
        {mobileOpen && <div className="mt-2 rounded-xl border border-border bg-white p-3">{list}</div>}
      </div>

      <aside className="hidden lg:block">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          On this page
        </p>
        <nav aria-label="Table of contents">{list}</nav>
      </aside>
    </>
  );
}
