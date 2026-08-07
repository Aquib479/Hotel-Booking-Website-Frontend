import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrency } from "@/context/CurrencyContext";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  FEATURED_CURRENCIES,
  type CurrencyCode,
} from "@/lib/currency/types";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
  variant?: "default" | "overlay";
}

export function CurrencySwitcher({
  className,
  variant = "default",
}: CurrencySwitcherProps) {
  const { currency, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = currencies.find((c) => c.code === currency) ?? currencies[0];

  const featured = useMemo(
    () =>
      FEATURED_CURRENCIES.map((code) => currencies.find((c) => c.code === code)).filter(
        Boolean
      ) as typeof CURRENCIES,
    [currencies]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return currencies;
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [currencies, query]);

  const select = (code: CurrencyCode) => {
    setCurrency(code);
    setOpen(false);
    setQuery("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors",
            variant === "overlay"
              ? "border-white/30 bg-white/15 text-white hover:bg-white/25"
              : "border-border bg-background text-foreground hover:bg-muted",
            className
          )}
        >
          <span>{current?.code ?? DEFAULT_CURRENCY}</span>
          <span className="text-muted-foreground">{current?.symbol}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle>Select currency</DialogTitle>
        </DialogHeader>

        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="max-h-[min(60vh,28rem)] overflow-y-auto px-2 py-2">
          {!query.trim() && (
            <div className="mb-2">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Popular
              </p>
              {featured.map((c) => (
                <CurrencyRow
                  key={`featured-${c.code}`}
                  code={c.code}
                  label={c.label}
                  selected={currency === c.code}
                  onSelect={select}
                />
              ))}
              <p className="mt-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                All currencies
              </p>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No currencies found
            </p>
          ) : (
            filtered.map((c) => (
              <CurrencyRow
                key={c.code}
                code={c.code}
                label={c.label}
                selected={currency === c.code}
                onSelect={select}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CurrencyRow({
  code,
  label,
  selected,
  onSelect,
}: {
  code: CurrencyCode;
  label: string;
  selected: boolean;
  onSelect: (code: CurrencyCode) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted",
        selected && "bg-brand/5"
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground">{code}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
      {selected && <Check className="size-4 shrink-0 text-brand" />}
    </button>
  );
}
