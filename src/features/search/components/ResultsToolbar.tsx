import { ArrowUpDown, LayoutList, Map, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "../constants";
import type { SortOption, ViewMode } from "../types";

interface ResultsToolbarProps {
  location: string;
  totalResults: number;
  isStreaming?: boolean;
  mode: "rest" | "stay";
  sort: SortOption;
  view: ViewMode;
  nameQuery: string;
  onNameQueryChange: (value: string) => void;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: ViewMode) => void;
}

export function ResultsToolbar({
  location,
  totalResults,
  isStreaming = false,
  mode,
  sort,
  view,
  nameQuery,
  onNameQueryChange,
  onSortChange,
  onViewChange,
}: ResultsToolbarProps) {
  const sortOptions = SORT_OPTIONS.filter(
    (option) => mode === "rest" || option.value !== "soonest-slot"
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="min-w-0 flex-1 text-lg font-semibold text-foreground sm:text-xl">
        {location.trim()
          ? (
              <>
                {isStreaming && totalResults === 0
                  ? "Searching stays near "
                  : (
                      <>
                        Found {totalResults.toLocaleString()}{" "}
                        {mode === "rest" ? "rest slots" : "stays"} near{" "}
                      </>
                    )}
                <span className="inline max-w-full font-bold [overflow-wrap:anywhere] sm:truncate sm:inline-block sm:max-w-[min(100%,28rem)] sm:align-bottom sm:[overflow-wrap:normal]">
                  {location}
                </span>
                {isStreaming && totalResults > 0 ? (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    · updating…
                  </span>
                ) : null}
              </>
            )
          : "Search hotels"}
      </h2>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={nameQuery}
            onChange={(e) => onNameQueryChange(e.target.value)}
            placeholder="Search hotel name"
            aria-label="Search hotels by name"
            className="h-9 rounded-md pl-9 pr-9 text-sm"
          />
          {nameQuery ? (
            <button
              type="button"
              onClick={() => onNameQueryChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear hotel name search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="h-9 w-38 shrink-0 rounded-md border-border bg-white px-2.5 text-xs sm:w-40 sm:text-sm">
            <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex shrink-0 rounded-md border border-border bg-white p-0.5">
          {(
            [
              { mode: "card" as const, icon: LayoutList, label: "Card view" },
              { mode: "map" as const, icon: Map, label: "Map view" },
            ] as const
          ).map(({ mode: viewMode, icon: Icon, label }) => (
            <button
              key={viewMode}
              type="button"
              onClick={() => onViewChange(viewMode)}
              aria-label={label}
              title={label}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-md transition-colors",
                view === viewMode
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
