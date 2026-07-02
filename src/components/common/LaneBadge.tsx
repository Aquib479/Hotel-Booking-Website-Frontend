import type { BookingLane } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

const LANE_STYLES: Record<
  BookingLane,
  { label: string; className: string }
> = {
  direct: {
    label: "RestHalf Exclusive",
    className: "bg-brand/15 text-brand",
  },
  wholesale: {
    label: "Partner rate",
    className: "bg-slate-100 text-slate-600",
  },
};

interface LaneBadgeProps {
  lane: BookingLane;
  className?: string;
}

/** Single source of truth for lane labels/colors — used on cards, detail, checkout */
export function LaneBadge({ lane, className }: LaneBadgeProps) {
  const config = LANE_STYLES[lane];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
