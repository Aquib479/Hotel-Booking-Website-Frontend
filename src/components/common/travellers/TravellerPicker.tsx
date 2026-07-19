import { useEffect, useState, type ReactNode } from "react";
import { Info, Minus, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type {
  BooleanTravellerKey,
  CountTravellerKey,
  TravellerSelection,
} from "./types";
import {
  BOOLEAN_TRAVELLER_OPTIONS,
  COUNT_TRAVELLER_OPTIONS,
  FAMILY_BOOLEAN_OPTIONS,
  MAX_TRAVELLERS,
  countTravellers,
  formatTravellersLabel,
  selectionFromGuestsLabel,
} from "./traveller-utils";

interface TravellerPickerProps {
  value: string;
  onChange: (guestsLabel: string) => void;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function QuantityStepper({
  value,
  onChange,
  disabledDecrease,
  disabledIncrease,
}: {
  value: number;
  onChange: (next: number) => void;
  disabledDecrease?: boolean;
  disabledIncrease?: boolean;
}) {
  return (
    <div className="flex h-9 items-center gap-3 rounded-full bg-muted px-3 shadow-[inset_0_1px_3px_rgba(15,23,42,0.12)]">
      <button
        type="button"
        aria-label="Decrease"
        disabled={disabledDecrease || value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="flex size-6 items-center justify-center text-brand transition-opacity disabled:opacity-30"
      >
        <Minus className="size-4 stroke-[2.5]" />
      </button>
      <span className="min-w-4 text-center text-sm font-semibold text-foreground">{value}</span>
      <button
        type="button"
        aria-label="Increase"
        disabled={disabledIncrease}
        onClick={() => onChange(value + 1)}
        className="flex size-6 items-center justify-center text-brand transition-opacity disabled:opacity-30"
      >
        <Plus className="size-4 stroke-[2.5]" />
      </button>
    </div>
  );
}

function BooleanRow({
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 py-2.5",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={(next) => onCheckedChange(next === true)}
        className="size-5 rounded-[5px] border-brand data-checked:border-brand data-checked:bg-brand"
      />
      <span className="text-[15px] font-medium text-foreground">{label}</span>
    </label>
  );
}

function CountRow({
  label,
  count,
  onCountChange,
  canIncrease,
}: {
  label: string;
  count: number;
  onCountChange: (count: number) => void;
  canIncrease: boolean;
}) {
  const checked = count > 0;
  const checkboxDisabled = !checked && !canIncrease;

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <label
        className={cn(
          "flex min-w-0 flex-1 cursor-pointer items-center gap-3",
          checkboxDisabled && "cursor-not-allowed opacity-50"
        )}
      >
        <Checkbox
          checked={checked}
          disabled={checkboxDisabled}
          onCheckedChange={(next) => onCountChange(next === true ? Math.max(1, count || 1) : 0)}
          className="size-5 rounded-[5px] border-brand data-checked:border-brand data-checked:bg-brand"
        />
        <span className="text-[15px] font-medium text-foreground">{label}</span>
      </label>
      {checked ? (
        <QuantityStepper
          value={count}
          onChange={onCountChange}
          disabledDecrease={count <= 0}
          disabledIncrease={!canIncrease}
        />
      ) : null}
    </div>
  );
}

export function TravellerPicker({
  value,
  onChange,
  children,
  open: controlledOpen,
  onOpenChange,
}: TravellerPickerProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [draft, setDraft] = useState<TravellerSelection>(() => selectionFromGuestsLabel(value));

  useEffect(() => {
    if (open) {
      setDraft(selectionFromGuestsLabel(value));
    }
  }, [open, value]);

  const total = countTravellers(draft);
  const canIncrease = total < MAX_TRAVELLERS;

  function setBoolean(key: BooleanTravellerKey, checked: boolean) {
    setDraft((prev) => {
      const next = { ...prev, [key]: checked };
      if (countTravellers(next) < 1) return prev;
      if (!checked) return next;
      if (countTravellers(prev) >= MAX_TRAVELLERS && !prev[key]) return prev;
      return next;
    });
  }

  function setCount(key: CountTravellerKey, count: number) {
    setDraft((prev) => {
      const without = { ...prev, [key]: 0 };
      const used = countTravellers(without);
      const allowed = Math.min(Math.max(0, count), MAX_TRAVELLERS - used);
      const next = { ...prev, [key]: allowed };
      if (countTravellers(next) < 1) return prev;
      return next;
    });
  }

  function handleConfirm() {
    if (total < 1) return;
    onChange(formatTravellersLabel(draft));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="w-[min(100%,22rem)] gap-0 rounded-3xl border-0 p-0 shadow-2xl sm:max-w-[22rem]"
      >
        <div className="flex items-start justify-between px-6 pt-5 pb-2">
          <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
            Select travellers
          </DialogTitle>
          <DialogDescription className="sr-only">
            Choose who is travelling and how many guests to include.
          </DialogDescription>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-foreground transition-colors hover:bg-brand/15"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-1">
          {BOOLEAN_TRAVELLER_OPTIONS.map((option) => (
            <BooleanRow
              key={option.key}
              label={option.label}
              checked={draft[option.key]}
              disabled={!draft[option.key] && !canIncrease}
              onCheckedChange={(checked) => setBoolean(option.key, checked)}
            />
          ))}

          {COUNT_TRAVELLER_OPTIONS.map((option) => (
            <CountRow
              key={option.key}
              label={option.label}
              count={draft[option.key]}
              onCountChange={(count) => setCount(option.key, count)}
              canIncrease={canIncrease}
            />
          ))}

          {FAMILY_BOOLEAN_OPTIONS.map((option) => (
            <BooleanRow
              key={option.key}
              label={option.label}
              checked={draft[option.key]}
              disabled={!draft[option.key] && !canIncrease}
              onCheckedChange={(checked) => setBoolean(option.key, checked)}
            />
          ))}

          <CountRow
            label="Relatives"
            count={draft.relatives}
            onCountChange={(count) => setCount("relatives", count)}
            canIncrease={canIncrease}
          />

          <div className="flex items-start gap-2 py-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <p>
              Relatives includes Siblings, In-laws, Grandparents, Grandchildren, Nephew, Niece,
              Uncle &amp; Aunt.
            </p>
          </div>
        </div>

        <div className="px-6 pb-6 pt-1">
          <button
            type="button"
            disabled={total < 1}
            onClick={handleConfirm}
            className={cn(
              "h-12 w-full rounded-full bg-brand text-[15px] font-semibold text-brand-foreground shadow-md transition-opacity",
              total < 1 ? "opacity-50" : "hover:bg-brand/90"
            )}
          >
            Add <span className="font-bold">{total}</span> traveller{total === 1 ? "" : "s"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
