import { useState } from "react";
import { Link } from "react-router-dom";
import {
  addMonths,
  differenceInCalendarDays,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Bath,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  CigaretteOff,
  DoorOpen,
  Loader2,
  Maximize2,
  Pencil,
  ShieldCheck,
  Star,
  Users,
  Utensils,
  Wifi,
  Wind,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatPrice } from "@/lib/currency/format";
import type { CurrencyCode } from "@/lib/currency/types";
import { CURRENCIES } from "@/lib/currency/types";
import { cn } from "@/lib/utils";
import type { CheckoutDraft } from "../types";
import { draftToDetailSearchParams, formatGuestsSummary } from "../utils";
import { SlotHoldCountdown } from "./SlotHoldCountdown";

const MAX_ROOMS = 9;

function toCurrencyCode(code: string | undefined): CurrencyCode {
  const upper = (code || "USD").toUpperCase();
  return CURRENCIES.some((c) => c.code === upper)
    ? (upper as CurrencyCode)
    : "USD";
}

function ratingLabel(rating: number) {
  if (rating >= 9) return "Excellent";
  if (rating >= 8) return "Very good";
  if (rating >= 7) return "Good";
  if (rating > 0) return "Guest score";
  return null;
}

function formatStayHeading(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return null;
  try {
    return `${format(parseISO(checkIn), "EEE, MMM d")} – ${format(parseISO(checkOut), "EEE, MMM d")}`;
  } catch {
    return null;
  }
}

function parseDraftDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function scaleTotal(
  total: number | undefined,
  fromNights: number,
  fromRooms: number,
  toNights: number,
  toRooms: number,
) {
  if (total == null || total <= 0) return total;
  const unit = total / Math.max(1, fromNights) / Math.max(1, fromRooms);
  return Math.round(unit * toNights * toRooms * 100) / 100;
}

interface BookingSummaryCardProps {
  draft: CheckoutDraft;
  onHoldExpire: () => void;
  onDraftChange: (next: CheckoutDraft) => void;
  isRefreshingPrice?: boolean;
}

export function BookingSummaryCard({
  draft,
  onHoldExpire,
  onDraftChange,
  isRefreshingPrice = false,
}: BookingSummaryCardProps) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [roomsOpen, setRoomsOpen] = useState(false);
  const [datesOpen, setDatesOpen] = useState(false);

  const hotelName = draft.hotelMeta?.name ?? "Hotel";
  const hotelImage = draft.roomImageUrl || draft.hotelMeta?.imageUrl || "";
  const hotelLocation = draft.hotelMeta
    ? [draft.hotelMeta.address, draft.hotelMeta.city, draft.hotelMeta.country]
        .filter(Boolean)
        .join(", ")
    : "";
  const starRating = draft.hotelMeta?.starRating ?? 0;
  const rating = draft.hotelMeta?.rating ?? 0;
  const reviewCount = draft.hotelMeta?.reviewCount ?? 0;
  const editParams = draftToDetailSearchParams(draft);

  const draftCurrency = toCurrencyCode(draft.currency);
  // Reserved rate is already in API currency — never convert on the client.
  const displayTotal =
    draft.totalPrice != null && draft.totalPrice > 0 ? draft.totalPrice : 0;
  const formatMoney = (amount: number) => formatPrice(amount, draftCurrency);

  const nights = Math.max(1, draft.nights ?? 1);
  const rooms = Math.min(MAX_ROOMS, Math.max(1, draft.rooms ?? 1));
  const perNight = displayTotal > 0 ? displayTotal / nights / rooms : 0;
  const stayHeading = formatStayHeading(draft.checkIn, draft.checkOut);
  const hasBreakfast = /breakfast|bb|half.?board|full.?board/i.test(
    draft.boardBasis ?? "",
  );
  const guestsLabel = formatGuestsSummary(draft.guests);
  const sleeps = Math.min(
    Math.max(draft.maxGuests ?? draft.guests.adults + draft.guests.children, 1),
    6,
  );

  const checkInDate = parseDraftDate(draft.checkIn);
  const checkOutDate = parseDraftDate(draft.checkOut);
  const today = startOfDay(new Date());
  const maxDate = addMonths(today, 6);
  const selectedRange: DateRange | undefined =
    checkInDate || checkOutDate
      ? { from: checkInDate, to: checkOutDate }
      : undefined;

  const facilityLines = buildFacilityLines(draft);

  const handleDatesChange = (range: { checkIn?: Date; checkOut?: Date }) => {
    if (!range.checkIn || !range.checkOut) {
      onDraftChange({
        ...draft,
        checkIn: range.checkIn?.toISOString(),
        checkOut: range.checkOut?.toISOString(),
      });
      return;
    }

    const nextNights = Math.max(
      1,
      differenceInCalendarDays(range.checkOut, range.checkIn),
    );
    onDraftChange({
      ...draft,
      checkIn: range.checkIn.toISOString(),
      checkOut: range.checkOut.toISOString(),
      nights: nextNights,
      totalPrice: scaleTotal(
        draft.totalPrice,
        nights,
        rooms,
        nextNights,
        rooms,
      ),
    });
  };

  const handleRoomsChange = (nextRooms: number) => {
    const clamped = Math.min(MAX_ROOMS, Math.max(1, nextRooms));
    onDraftChange({
      ...draft,
      rooms: clamped,
      totalPrice: scaleTotal(draft.totalPrice, nights, rooms, nights, clamped),
    });
    setRoomsOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Card 1 — Hotel & room */}
      <section className="overflow-hidden rounded-xl rounded-b-none border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <div className="flex gap-3 p-4">
          {hotelImage ? (
            <img
              src={hotelImage}
              alt={hotelName}
              className="size-[4.5rem] shrink-0 rounded-xl object-cover ring-1 ring-border/60"
            />
          ) : (
            <div className="flex size-[4.5rem] shrink-0 items-center justify-center rounded-xl bg-muted ring-1 ring-border/60">
              <DoorOpen className="size-6 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                {hotelName}
              </h2>
              {starRating > 0 ? (
                <span
                  className="inline-flex items-center gap-0.5"
                  aria-label={`${starRating} stars`}
                >
                  {Array.from({ length: Math.min(5, starRating) }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="size-3 fill-amber-400 text-amber-400"
                      />
                    ),
                  )}
                </span>
              ) : null}
            </div>

            {rating > 0 ? (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="rounded-md bg-brand px-1.5 py-0.5 font-bold text-white">
                  {rating.toFixed(1)}
                </span>
                {ratingLabel(rating) ? (
                  <span className="font-medium text-brand">
                    {ratingLabel(rating)}
                  </span>
                ) : null}
                {reviewCount > 0 ? (
                  <span className="text-muted-foreground">
                    {reviewCount.toLocaleString()} reviews
                  </span>
                ) : null}
              </div>
            ) : null}

            {hotelLocation ? (
              <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                {hotelLocation}
              </p>
            ) : null}
          </div>
        </div>

        <div className="border-t border-border/70 px-4 py-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-foreground">
                {draft.roomName || "Selected room"}
              </p>
              {draft.roomTypeLabel ? (
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-brand">
                  {draft.roomTypeLabel}
                </p>
              ) : null}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
              <Users className="size-3.5" />×{sleeps}
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Guests: {guestsLabel}
            {draft.maxGuests ? ` · Up to ${draft.maxGuests} per room` : ""}
          </p>

          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {draft.bedSummary ? (
              <li className="flex items-start gap-2">
                <BedDouble className="mt-0.5 size-3.5 shrink-0" />
                {draft.bedSummary}
              </li>
            ) : null}
            {draft.boardBasis ? (
              <li
                className={cn(
                  "flex items-start gap-2",
                  hasBreakfast && "font-medium text-emerald-700",
                )}
              >
                <Utensils className="mt-0.5 size-3.5 shrink-0" />
                {draft.boardBasis}
              </li>
            ) : null}
            {facilityLines.map((item) => (
              <li key={item.label} className="flex items-start gap-2">
                <item.icon className="mt-0.5 size-3.5 shrink-0" />
                {item.label}
              </li>
            ))}
            <li className="flex items-start gap-2 text-emerald-700">
              <Zap className="mt-0.5 size-3.5 shrink-0" />
              Instant confirmation
            </li>
          </ul>

          {draft.refundable != null || draft.cancellationText ? (
            <p
              className={cn(
                "mt-3 flex items-start gap-2 text-sm font-medium",
                draft.refundable ? "text-emerald-700" : "text-muted-foreground",
              )}
            >
              {draft.refundable ? (
                <Check className="mt-0.5 size-4 shrink-0" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0" />
              )}
              <span>
                {draft.cancellationText?.trim() ||
                  (draft.refundable
                    ? "Free cancellation available"
                    : "Non-refundable")}
              </span>
            </p>
          ) : null}
        </div>
      </section>

      {/* Card 2 — Stay dates + editable nights/rooms */}
      <section className="border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <div className="px-4 py-3.5">
          {draft.mode === "stay" && stayHeading ? (
            <>
              <p className="text-base font-semibold text-foreground">
                {stayHeading}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Check-in from afternoon · Check-out by noon
              </p>
            </>
          ) : (
            <>
              <p className="text-base font-semibold text-foreground">
                {draft.mode === "rest" ? "Rest slot booking" : "Your stay"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {guestsLabel}
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 divide-x divide-border border-t border-border">
          {draft.mode === "stay" ? (
            <Popover open={datesOpen} onOpenChange={setDatesOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm transition hover:bg-muted/40"
                >
                  <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 font-medium text-foreground">
                    {nights} night{nights === 1 ? "" : "s"}
                  </span>
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="bottom"
                sideOffset={8}
                className="w-[min(92vw,22rem)] p-0 sm:w-[min(92vw,42rem)]"
              >
                <div className="p-3 sm:p-4">
                  <Calendar
                    mode="range"
                    numberOfMonths={2}
                    selected={selectedRange}
                    onSelect={(range) => {
                      const from = range?.from;
                      const to = range?.to;
                      const hasCheckout =
                        !!from &&
                        !!to &&
                        differenceInCalendarDays(to, from) > 0;

                      handleDatesChange({
                        checkIn: from,
                        checkOut: hasCheckout ? to : undefined,
                      });

                      if (hasCheckout) {
                        window.setTimeout(() => setDatesOpen(false), 180);
                      }
                    }}
                    disabled={{ before: today, after: maxDate }}
                    defaultMonth={checkInDate ?? today}
                    captionLayout="dropdown"
                    startMonth={startOfMonth(today)}
                    endMonth={startOfMonth(maxDate)}
                    className="mx-auto [--cell-size:2.2rem]"
                    formatters={{
                      formatMonthDropdown: (date) => format(date, "MMMM"),
                      formatYearDropdown: (date) => format(date, "yyyy"),
                    }}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-border/70 bg-muted/40 px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {checkInDate && checkOutDate ? (
                      <>
                        <span className="font-semibold text-foreground">
                          {nights}
                        </span>{" "}
                        night{nights === 1 ? "" : "s"} selected
                      </>
                    ) : checkInDate ? (
                      "Now pick your check-out date"
                    ) : (
                      "Pick your check-in date"
                    )}
                  </p>
                  <Button
                    type="button"
                    variant="brand"
                    size="sm"
                    className="rounded-lg px-4"
                    disabled={!checkInDate || !checkOutDate}
                    onClick={() => setDatesOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3 text-sm">
              <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
              <span className="font-medium text-foreground">1 slot</span>
            </div>
          )}

          <Popover open={roomsOpen} onOpenChange={setRoomsOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-3 py-3 text-left text-sm transition hover:bg-muted/40"
              >
                <DoorOpen className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 font-medium text-foreground">
                  {rooms} room{rooms === 1 ? "" : "s"}
                </span>
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-1.5">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Rooms
              </p>
              <div className="max-h-56 overflow-y-auto">
                {Array.from({ length: MAX_ROOMS }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleRoomsChange(n)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition hover:bg-muted",
                      n === rooms && "bg-brand/10 font-semibold text-brand",
                    )}
                  >
                    <span>
                      {n} room{n === 1 ? "" : "s"}
                    </span>
                    {n === rooms ? <Check className="size-3.5" /> : null}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {draft.mode === "stay" && !checkOutDate && checkInDate ? (
          <p className="border-t border-border px-4 py-2 text-xs text-amber-700">
            Select a check-out date to update your stay.
          </p>
        ) : null}

        {draft.lane === "direct" && draft.holdExpiresAt ? (
          <div className="border-t border-border px-4 py-3">
            <SlotHoldCountdown
              holdExpiresAt={draft.holdExpiresAt}
              onExpire={onHoldExpire}
            />
          </div>
        ) : null}
      </section>

      {/* Card 3 — Price details */}
      <section className="overflow-hidden rounded-xl rounded-t-none border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <button
          type="button"
          onClick={() => setPriceOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-muted/30"
        >
          <h3 className="font-semibold text-foreground">Price Details</h3>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition",
              priceOpen && "rotate-180",
            )}
          />
        </button>

        {priceOpen && displayTotal > 0 ? (
          <div className="space-y-2.5 border-t border-border/70 px-4 py-3.5 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">
                {rooms} room{rooms === 1 ? "" : "s"} × {nights} night
                {nights === 1 ? "" : "s"}
              </span>
              <span className="font-medium text-foreground">
                {formatMoney(displayTotal)}
              </span>
            </div>
            {perNight > 0 ? (
              <p className="text-xs text-muted-foreground">
                Avg. {formatMoney(perNight)} / night / room
              </p>
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Taxes & fees</span>
              <span className="font-medium text-foreground">Included</span>
            </div>
          </div>
        ) : null}

        <div className="border-t border-dashed border-border px-4 py-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-base font-bold text-foreground">Total</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {isRefreshingPrice
                  ? "Updating for selected currency…"
                  : draft.source === "zentrumhub"
                    ? "Estimate · confirmed at payment"
                    : "Amount due"}
              </p>
            </div>
            {isRefreshingPrice ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin text-brand" />
                Updating…
              </div>
            ) : displayTotal > 0 ? (
              <p className="text-right text-xl font-bold tracking-tight text-foreground">
                {formatMoney(displayTotal)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Price pending</p>
            )}
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <ShieldCheck className="size-3.5" />
            Secure checkout · best available rate
          </p>
        </div>
      </section>
    </div>
  );
}

function buildFacilityLines(draft: CheckoutDraft) {
  const lines: Array<{
    label: string;
    icon: typeof Wifi;
  }> = [];

  const fromApi = draft.roomFacilities ?? [];
  for (const label of fromApi.slice(0, 4)) {
    const lower = label.toLowerCase();
    let icon = Maximize2;
    if (/wifi|wi-?fi/.test(lower)) icon = Wifi;
    else if (/bath/.test(lower)) icon = Bath;
    else if (/air|ac|cooling/.test(lower)) icon = Wind;
    else if (/smoke|smoking/.test(lower)) icon = CigaretteOff;
    lines.push({ label, icon });
  }

  const defaults = [
    { label: "Free Wi-Fi", icon: Wifi, match: /wifi|wi-?fi/i },
    { label: "Non-smoking", icon: CigaretteOff, match: /smoke|smoking/i },
    { label: "Private bathroom", icon: Bath, match: /bath/i },
    { label: "Air conditioning", icon: Wind, match: /air|ac|cooling/i },
  ];

  for (const d of defaults) {
    if (lines.some((l) => d.match.test(l.label))) continue;
    lines.push({ label: d.label, icon: d.icon });
    if (lines.length >= 5) break;
  }

  return lines.slice(0, 5);
}
