import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FilterPillOption<T extends string> {
  id: T;
  label: string;
  count?: number;
}

interface FilterPillGroupProps<T extends string> {
  options: FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

export function FilterPillGroup<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel = "Filters",
}: FilterPillGroupProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("flex gap-2 overflow-x-auto pb-1", className)}
    >
      {options.map((option) => {
        const active = value === option.id;
        return (
          <Button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            variant={active ? "brand" : "outline"}
            size="sm"
            className={cn(
              "shrink-0 rounded-full px-4 shadow-none",
              !active && "bg-white"
            )}
            onClick={() => onChange(option.id)}
          >
            {option.label}
            {option.count !== undefined && (
              <span className="ml-1 opacity-80">({option.count})</span>
            )}
          </Button>
        );
      })}
    </div>
  );
}
