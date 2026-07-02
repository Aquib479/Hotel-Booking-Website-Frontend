import { ArrowUpDown } from "lucide-react";
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
  sort: SortOption;
  view: ViewMode;
  onSortChange: (sort: SortOption) => void;
  onViewChange: (view: ViewMode) => void;
}

export function ResultsToolbar({
  location,
  totalResults,
  sort,
  view,
  onSortChange,
  onViewChange,
}: ResultsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">
        Found {totalResults} results near{" "}
        <span className="font-bold">{location}</span>
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="h-10 w-36 rounded-lg border-border bg-white">
            <ArrowUpDown className="size-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border border-border bg-white p-1">
          {(["map", "card"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onViewChange(mode)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                view === mode
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
