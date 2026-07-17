import { REST_SLOTS, type RestSlot } from "@/lib/booking/types";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WalkInSlotSelectorProps {
  availableSlots: RestSlot[];
  value: RestSlot | null;
  onChange: (slot: RestSlot) => void;
  disabled?: boolean;
}

export function WalkInSlotSelector({
  availableSlots,
  value,
  onChange,
  disabled,
}: WalkInSlotSelectorProps) {
  return (
    <SectionCard title="Slot window · today" description="Hotel local time · walk-in only">
      {availableSlots.length === 0 ? (
        <p className="text-sm text-muted-foreground">Select a room to see available slots.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-3">
          {REST_SLOTS.filter((s) => availableSlots.includes(s.value)).map((slot) => (
            <Button
              key={slot.value}
              type="button"
              variant={value === slot.value ? "brand" : "outline"}
              disabled={disabled}
              className={cn("h-auto flex-col items-start px-3 py-3 text-left")}
              onClick={() => onChange(slot.value)}
            >
              {slot.label}
            </Button>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
