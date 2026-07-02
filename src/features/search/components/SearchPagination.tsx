import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchPaginationProps {
  page: number;
  totalPages: number;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, "...", total - 1, total];
  if (current >= total - 2) return [1, 2, "...", total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function SearchPagination({
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
}: SearchPaginationProps) {
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>

        {pages.map((p, index) =>
          p === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "flex size-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                page === p
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Show:</span>
        <Select value={String(perPage)} onValueChange={(v) => onPerPageChange(Number(v))}>
          <SelectTrigger className="h-9 w-16 border-border bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[6, 9, 12, 18].map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
