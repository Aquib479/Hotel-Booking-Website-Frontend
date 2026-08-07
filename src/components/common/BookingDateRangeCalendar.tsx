import {
  differenceInCalendarDays,
  format,
  startOfDay,
  startOfMonth,
  addMonths,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface BookingDateRangeCalendarProps {
  checkIn?: Date;
  checkOut?: Date;
  onChange: (range: { checkIn?: Date; checkOut?: Date }) => void;
  trigger?: ReactNode;
  triggerClassName?: string;
  label?: string;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnComplete?: boolean;
  /** Extra classes for the floating calendar panel. */
  panelClassName?: string;
}

function formatShort(date?: Date) {
  if (!date) return "Select";
  return format(date, "dd MMM yyyy");
}

export function BookingDateRangeCalendar({
  checkIn,
  checkOut,
  onChange,
  trigger,
  triggerClassName,
  label,
  className,
  open: controlledOpen,
  onOpenChange,
  closeOnComplete = true,
  panelClassName,
}: BookingDateRangeCalendarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const rootRef = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const maxDate = addMonths(today, 6);
  const startMonth = startOfMonth(today);
  const endMonth = startOfMonth(maxDate);

  const selected: DateRange | undefined =
    checkIn || checkOut ? { from: checkIn, to: checkOut } : undefined;

  const nights =
    checkIn && checkOut
      ? Math.max(1, differenceInCalendarDays(checkOut, checkIn))
      : 0;

  const isPlaceholder = !checkIn && !checkOut;

  const handleOpenChange = (next: boolean) => setOpen(next);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      handleOpenChange(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleOpenChange(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const defaultTrigger = (
    <button
      type="button"
      className={cn(
        "flex w-full min-w-0 items-center gap-2 rounded-xl bg-muted/50 px-3 py-3 text-left transition hover:bg-muted/80",
        triggerClassName
      )}
    >
      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      <span
        className={cn(
          "truncate text-sm",
          isPlaceholder
            ? "font-medium text-muted-foreground"
            : "font-semibold text-foreground"
        )}
      >
        {checkIn && checkOut
          ? `${formatShort(checkIn)} - ${formatShort(checkOut)}`
          : checkIn
            ? `${formatShort(checkIn)} - Add checkout`
            : "Add dates"}
      </span>
    </button>
  );

  const triggerNode = trigger ?? defaultTrigger;
  const renderedTrigger = isValidElement(triggerNode)
    ? cloneElement(
        triggerNode as ReactElement<{ onClick?: (e: ReactMouseEvent) => void }>,
        {
          onClick: (event: ReactMouseEvent) => {
            (
              triggerNode as ReactElement<{
                onClick?: (e: ReactMouseEvent) => void;
              }>
            ).props.onClick?.(event);
            handleOpenChange(!open);
          },
        }
      )
    : (
        <button type="button" onClick={() => handleOpenChange(!open)}>
          {triggerNode}
        </button>
      );

  return (
    <div ref={rootRef} className={cn("relative z-20 min-w-0 flex-1", className)}>
      {label ? (
        <p className="mb-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </p>
      ) : null}
      {renderedTrigger}

      {open ? (
        <div
          role="dialog"
          aria-modal="false"
          className={cn(
            "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-[min(92vw,42rem)] overflow-hidden rounded-2xl border border-border/80 bg-white shadow-2xl shadow-brand/10",
            panelClassName
          )}
        >
          <div className="bg-white p-3 sm:p-4">
            <Calendar
              mode="range"
              numberOfMonths={2}
              selected={selected}
              onSelect={(range) => {
                const from = range?.from;
                const to = range?.to;
                const hasCheckout =
                  !!from && !!to && differenceInCalendarDays(to, from) > 0;

                onChange({
                  checkIn: from,
                  checkOut: hasCheckout ? to : undefined,
                });

                if (closeOnComplete && hasCheckout) {
                  window.setTimeout(() => handleOpenChange(false), 200);
                }
              }}
              disabled={{ before: today, after: maxDate }}
              defaultMonth={checkIn ?? today}
              captionLayout="dropdown"
              startMonth={startMonth}
              endMonth={endMonth}
              className="mx-auto [--cell-size:2.3rem]"
              formatters={{
                formatMonthDropdown: (date) => format(date, "MMMM"),
                formatYearDropdown: (date) => format(date, "yyyy"),
              }}
              classNames={{
                months: "relative flex flex-col gap-6 sm:flex-row sm:gap-8",
                month: "flex w-full min-w-[16.5rem] flex-col gap-3",
                month_caption:
                  "relative flex h-11 w-full items-center justify-center px-10",
                dropdowns: "flex items-center justify-center gap-2",
                dropdown_root:
                  "relative inline-flex min-w-[5.25rem] items-center justify-center gap-1 rounded-lg border border-brand/25 bg-brand/5 px-2.5 py-1.5 text-sm font-semibold text-brand shadow-sm transition hover:border-brand/40 hover:bg-white",
                caption_label:
                  "flex items-center gap-1 text-sm font-semibold text-brand [&>svg]:size-3.5 [&>svg]:text-brand",
                months_dropdown: "pr-0",
                years_dropdown: "pr-0",
                nav: "absolute inset-x-0 top-0 flex h-11 w-full items-center justify-between",
                button_previous:
                  "z-10 size-8 rounded-full border border-border bg-white text-brand shadow-sm hover:bg-brand/5",
                button_next:
                  "z-10 size-8 rounded-full border border-border bg-white text-brand shadow-sm hover:bg-brand/5",
                weekdays: "mt-1 flex",
                weekday:
                  "flex-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400",
                week: "mt-1 flex w-full",
                day: "group/day relative aspect-square h-full w-full p-0.5 text-center",
                today: "[&_button]:font-bold [&_button]:text-brand",
                range_start: "rounded-l-full bg-brand/15",
                range_middle: "rounded-none bg-brand/10",
                range_end: "rounded-r-full bg-brand/15",
                outside: "opacity-35",
                disabled: "opacity-30",
              }}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-muted/40 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {nights > 0 ? (
                <>
                  <span className="font-semibold text-foreground">{nights}</span>{" "}
                  night{nights === 1 ? "" : "s"} selected
                </>
              ) : checkIn ? (
                "Now pick your check-out date"
              ) : (
                "Pick your check-in date"
              )}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() =>
                  onChange({ checkIn: undefined, checkOut: undefined })
                }
              >
                Clear
              </Button>
              <Button
                type="button"
                variant="brand"
                size="sm"
                className="rounded-lg px-4"
                disabled={!checkIn || !checkOut}
                onClick={() => handleOpenChange(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
