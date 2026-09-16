import { useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export interface OccupancySelection {
  rooms: number;
  adults: number;
  children: number;
}

export const DEFAULT_OCCUPANCY: OccupancySelection = {
  rooms: 1,
  adults: 2,
  children: 0,
};

const MAX_ROOMS = 8;
const MAX_ADULTS = 16;
const MAX_CHILDREN = 8;

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function formatOccupancyLabel(value: OccupancySelection, t?: TranslateFn): string {
  if (t) {
    const adultPart =
      value.adults === 1
        ? t("common.adultOne")
        : t("common.adultsN", { n: value.adults });
    const childPart =
      value.children > 0
        ? value.children === 1
          ? t("common.childOne")
          : t("common.childrenN", { n: value.children })
        : "";
    const roomPart = value.rooms > 1 ? t("common.roomsN", { n: value.rooms }) : "";
    return `${adultPart}${childPart}${roomPart}`;
  }

  const adultPart = `${value.adults} Adult${value.adults === 1 ? "" : "s"}`;
  const childPart =
    value.children > 0
      ? `, ${value.children} Child${value.children === 1 ? "" : "ren"}`
      : "";
  const roomPart = value.rooms > 1 ? ` · ${value.rooms} Rooms` : "";
  return `${adultPart}${childPart}${roomPart}`;
}

export function parseOccupancyLabel(label: string): OccupancySelection {
  if (!label.trim()) return { ...DEFAULT_OCCUPANCY, adults: 0, rooms: 0 };

  const adultsMatch = label.match(/(\d+)\s*(?:adult|dewasa)/i);
  const childrenMatch =
    label.match(/(\d+)\s*(?:child|anak|kid)/i);
  const roomsMatch = label.match(/(\d+)\s*(?:room|kamar)/i);
  const travellersMatch = label.match(/(\d+)\s*(?:traveller|wisatawan|tamu)/i);

  if (!adultsMatch && !childrenMatch && !roomsMatch && travellersMatch) {
    return {
      rooms: 1,
      adults: Math.max(1, Number(travellersMatch[1])),
      children: 0,
    };
  }

  return {
    rooms: roomsMatch ? Math.max(1, Number(roomsMatch[1])) : 1,
    adults: adultsMatch ? Math.max(1, Number(adultsMatch[1])) : 2,
    children: childrenMatch ? Math.max(0, Number(childrenMatch[1])) : 0,
  };
}

function StepperRow({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={t("common.decrease", { label })}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className={cn(
            "flex size-8 items-center justify-center rounded-full border transition",
            value <= min
              ? "border-border text-muted-foreground/40"
              : "border-brand text-brand hover:bg-brand/5"
          )}
        >
          <Minus className="size-3.5" />
        </button>
        <span className="min-w-6 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          aria-label={t("common.increase", { label })}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className={cn(
            "flex size-8 items-center justify-center rounded-full border transition",
            value >= max
              ? "border-border text-muted-foreground/40"
              : "border-brand text-brand hover:bg-brand/5"
          )}
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

interface OccupancyPickerProps {
  value: OccupancySelection;
  onChange: (next: OccupancySelection) => void;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OccupancyPicker({
  value,
  onChange,
  children,
  open: controlledOpen,
  onOpenChange,
}: OccupancyPickerProps) {
  const { t } = useLanguage();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;
  const [draft, setDraft] = useState<OccupancySelection>(value);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(value);
    setOpen(next);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="divide-y divide-border px-4">
          <StepperRow
            label={t("common.rooms")}
            value={draft.rooms}
            min={1}
            max={MAX_ROOMS}
            onChange={(rooms) => setDraft((prev) => ({ ...prev, rooms }))}
          />
          <StepperRow
            label={t("common.adults")}
            hint={t("common.adultsHint")}
            value={draft.adults}
            min={1}
            max={MAX_ADULTS}
            onChange={(adults) => setDraft((prev) => ({ ...prev, adults }))}
          />
          <StepperRow
            label={t("common.children")}
            hint={t("common.childrenHint")}
            value={draft.children}
            min={0}
            max={MAX_CHILDREN}
            onChange={(children) => setDraft((prev) => ({ ...prev, children }))}
          />
        </div>
        <div className="flex justify-end border-t border-border px-4 py-3">
          <Button
            type="button"
            size="sm"
            className="rounded-lg bg-brand px-5 text-white hover:bg-brand/90"
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            {t("common.done")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
