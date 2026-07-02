import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  getAvailableSlots,
  isSlotBookable,
  resolveSlotSelection,
} from "@/lib/booking/availability";
import { REST_SLOTS, type RestSlot } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

interface SlotPickerProps {
  value: RestSlot;
  onChange: (slot: RestSlot) => void;
  restDate?: Date;
  /** IANA timezone — slot cutoffs use hotel local time, not the guest's browser */
  hotelTimezone: string;
  triggerClassName?: string;
  label?: string;
}

export function SlotPicker({
  value,
  onChange,
  restDate = new Date(),
  hotelTimezone,
  triggerClassName,
  label = "Slot",
}: SlotPickerProps) {
  const [open, setOpen] = useState(false);
  const availableSlots = getAvailableSlots(restDate, hotelTimezone);
  const selected = REST_SLOTS.find((s) => s.value === value);

  useEffect(() => {
    const resolved = resolveSlotSelection(value, restDate, hotelTimezone);
    if (resolved && resolved !== value) onChange(resolved);
  }, [restDate, hotelTimezone, value, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex min-w-0 flex-1 flex-col items-start gap-0.5 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-black/5 sm:px-5",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {label}
          </span>
          <span className="truncate text-sm font-semibold text-foreground sm:text-base">
            {availableSlots.length === 0
              ? "No slots today"
              : (selected?.label ?? "Select slot")}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-1" align="start">
        {availableSlots.length === 0 ? (
          <p className="px-3 py-2.5 text-sm text-muted-foreground">
            No slots left today at this hotel. Choose tomorrow or another date.
          </p>
        ) : (
          <ul>
            {REST_SLOTS.map((slot) => {
              const bookable = isSlotBookable(slot.value, restDate, hotelTimezone);
              return (
                <li key={slot.value}>
                  <button
                    type="button"
                    disabled={!bookable}
                    onClick={() => {
                      onChange(slot.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      bookable
                        ? "hover:bg-muted"
                        : "cursor-not-allowed text-muted-foreground/50",
                      value === slot.value && bookable && "bg-muted font-medium"
                    )}
                  >
                    <span className="block">{slot.label}</span>
                    {!bookable && (
                      <span className="text-xs text-muted-foreground">
                        Unavailable — ended or under 60 min left (hotel local time)
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
