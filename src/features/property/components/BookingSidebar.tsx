import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, ExternalLink, Loader2, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LaneBadge } from "@/components/common/LaneBadge";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { RestStayToggle } from "@/components/common/RestStayToggle";
import { SlotPicker } from "@/components/common/SlotPicker";
import type { RestSlot } from "@/lib/booking/types";
import {
  getAvailableSlots,
  resolveSlotSelection,
} from "@/lib/booking/availability";
import { getEarliestSelectableRestDate } from "@/lib/booking/timezone";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { buildCheckoutDraft, saveCheckoutDraftToStorage } from "@/features/checkout";
import { searchAvailability, createHold } from "@/features/checkout/api";
import { GUEST_OPTIONS } from "../data";
import { useBookingPricing } from "../hooks/useBookingPricing";
import type { BookingSidebarProps } from "../types";

export function BookingSidebar({
  propertyId,
  lane,
  priceUsd,
  priceIdr,
  mode,
  onModeChange,
  hotelTimezone,
  wholesalePricing,
  slotDuration = "12h",
  ringFencedRooms,
  supplierName,
  initialBooking,
}: BookingSidebarProps) {
  const navigate = useNavigate();
  const { format: formatCurrency, currency } = useCurrency();
  const isDirect = lane === "direct";
  const isDualMode = isDirect && slotDuration === "24h";

  const [booking, setBooking] = useState({
    checkIn: initialBooking?.checkIn ?? new Date(),
    checkOut: initialBooking?.checkOut ?? new Date(Date.now() + 86400000),
    restDate: initialBooking?.restDate ?? new Date(),
    slot: initialBooking?.slot ?? "12-24",
    guests: initialBooking?.guests ?? "2 adults",
  });

  const { isAuthenticated } = useAuth();
  const showSlotPicker = isDirect && (slotDuration === "12h" || mode === "rest");

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const pricing = useBookingPricing(
    lane,
    priceUsd,
    priceIdr,
    { mode, checkIn: booking.checkIn, checkOut: booking.checkOut },
    wholesalePricing,
    slotDuration
  );
  const formatDate = (date?: Date) => (date ? format(date, "MMM. d, yyyy") : "Select");

  function frontendSlotToBackend(slot: RestSlot): "HALF_DAY" | "FULL_DAY" {
    return slot === "24h" ? "FULL_DAY" : "HALF_DAY";
  }

  function parseGuestCount(label: string): number {
    const match = label.match(/(\d+)/);
    return match ? Number(match[1]) : 2;
  }

  const handleCheckout = async () => {
    if (showSlotPicker && booking.restDate) {
      const resolved = resolveSlotSelection(booking.slot, booking.restDate, hotelTimezone);
      if (!resolved || getAvailableSlots(booking.restDate, hotelTimezone).length === 0) return;
    }

    if (!isAuthenticated) {
      const draft = buildCheckoutDraft({
        propertyId,
        lane,
        mode,
        currency,
        hotelTimezone,
        guestsLabel: booking.guests,
        restDate: mode === "rest" ? booking.restDate : undefined,
        slot: mode === "rest" ? booking.slot : undefined,
        checkIn: mode === "stay" ? booking.checkIn : undefined,
        checkOut: mode === "stay" ? booking.checkOut : undefined,
      });
      saveCheckoutDraftToStorage(draft);
      navigate("/checkout");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const dateStr = mode === "rest" && booking.restDate
        ? format(booking.restDate, "yyyy-MM-dd")
        : format(booking.checkIn, "yyyy-MM-dd");

      const slotType = mode === "rest"
        ? frontendSlotToBackend((booking.slot as RestSlot) ?? "12-24")
        : "FULL_DAY" as const;

      const availability = await searchAvailability(propertyId, dateStr, slotType);

      if (availability.rooms.length === 0) {
        setBookingError("No rooms available for the selected date and slot.");
        setIsBooking(false);
        return;
      }

      const cheapestRoom = availability.rooms.reduce((best, room) =>
        room.price < best.price ? room : best
      );

      const holdResponse = await createHold({
        roomId: cheapestRoom.id,
        date: dateStr,
        slotType,
        numGuests: parseGuestCount(booking.guests),
      });

      const draft = buildCheckoutDraft({
        propertyId,
        lane,
        mode,
        currency,
        hotelTimezone,
        guestsLabel: booking.guests,
        restDate: mode === "rest" ? booking.restDate : undefined,
        slot: mode === "rest" ? booking.slot : undefined,
        checkIn: mode === "stay" ? booking.checkIn : undefined,
        checkOut: mode === "stay" ? booking.checkOut : undefined,
      });

      draft.roomId = cheapestRoom.id;
      draft.bookingId = holdResponse.bookingId;
      draft.holdExpiresAt = holdResponse.holdExpiresAt;
      draft.holdId = holdResponse.bookingId;
      draft.totalPrice = holdResponse.totalPrice;
      draft.currency = holdResponse.currency as typeof draft.currency;
      draft.hotelMeta = {
        name: holdResponse.hotel.name,
        address: holdResponse.hotel.address ?? "",
        city: holdResponse.hotel.city ?? "",
        country: holdResponse.hotel.country ?? "",
        imageUrl: holdResponse.hotel.imageUrl
          ?? holdResponse.hotel.imageUrls?.[0]
          ?? "",
        starRating: Math.round(holdResponse.hotel.rating ?? 4),
      };

      saveCheckoutDraftToStorage(draft);
      navigate("/checkout");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create booking hold";
      setBookingError(message);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-lg shadow-black/5">
      {isDualMode && onModeChange && (
        <div className="mb-4">
          <RestStayToggle value={mode} onChange={onModeChange} size="sm" />
        </div>
      )}

      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <PriceDisplay
            lane={lane}
            priceUsd={priceUsd}
            priceIdr={priceIdr}
            wholesalePricing={wholesalePricing}
            mode={mode}
            slotDuration={slotDuration}
            amountClassName="text-2xl"
          />
          <p className="text-xs text-muted-foreground">
            {mode === "rest" ? "Per slot, before taxes" : "Per night, before taxes"}
          </p>
        </div>
        <LaneBadge lane={lane} />
      </div>

      {isDirect && ringFencedRooms && (
        <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-brand/5 px-3 py-2 text-xs font-medium text-brand">
          <Zap className="size-3.5" />
          {ringFencedRooms} rooms reserved for RestHalf · instant confirmation
        </p>
      )}

      {!isDirect && (
        <p className="mb-4 flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs text-muted-foreground">
          <ExternalLink className="size-3.5 shrink-0" />
          You&apos;ll complete booking via {supplierName ?? "our partner"} after checkout
        </p>
      )}

      {showSlotPicker ? (
        <div className="space-y-3">
          <DateField
            label="Date"
            value={formatDate(booking.restDate)}
            selected={booking.restDate}
            onSelect={(restDate) => {
              if (restDate) setBooking((b) => ({ ...b, restDate }));
            }}
            disabledBefore={getEarliestSelectableRestDate(hotelTimezone)}
          />
          <SlotPicker
            value={booking.slot ?? "12-24"}
            onChange={(slot) => setBooking((b) => ({ ...b, slot }))}
            restDate={booking.restDate ?? new Date()}
            hotelTimezone={hotelTimezone}
            triggerClassName="w-full rounded-xl border border-border px-4 py-3 hover:bg-muted/40"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-border">
          <DateField
            label="Check-in"
            value={formatDate(booking.checkIn)}
            selected={booking.checkIn}
            onSelect={(checkIn) => {
              if (checkIn) setBooking((b) => ({ ...b, checkIn }));
            }}
          />
          <DateField
            label="Check-out"
            value={formatDate(booking.checkOut)}
            selected={booking.checkOut}
            onSelect={(checkOut) => {
              if (checkOut) setBooking((b) => ({ ...b, checkOut }));
            }}
            disabledBefore={booking.checkIn}
            className="border-l border-border"
          />
        </div>
      )}

      <div className="mt-3 overflow-hidden rounded-xl border border-border">
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm"
            >
              <span className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" />
                <span>
                  <span className="block text-xs text-muted-foreground">Guests</span>
                  <span className="font-medium text-foreground">{booking.guests}</span>
                </span>
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-2" align="start">
            <Select
              value={booking.guests}
              onValueChange={(guests) => setBooking((b) => ({ ...b, guests }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GUEST_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </div>

      <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>
            {pricing.label}
            {mode === "stay" && pricing.nights > 1 && ` × ${pricing.nights} nights`}
          </span>
          <span>{formatCurrency(pricing.subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Taxes & fees</span>
          <span>{formatCurrency(pricing.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
          <span>Total due</span>
          <span>{formatCurrency(pricing.totalDue)}</span>
        </div>
      </div>

      {bookingError && (
        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {bookingError}
        </p>
      )}

      <Button
        onClick={() => void handleCheckout()}
        disabled={isBooking}
        className="mt-5 h-12 w-full rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand/90"
      >
        {isBooking ? (
          <span className="flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Checking availability…
          </span>
        ) : isDirect ? "Continue to checkout" : "Continue via partner"}
      </Button>
    </div>
  );
}

function DateField({
  label,
  value,
  selected,
  onSelect,
  disabledBefore,
  className,
}: {
  label: string;
  value: string;
  selected?: Date;
  onSelect: (date?: Date) => void;
  disabledBefore?: Date;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex w-full flex-col items-start px-4 py-3 text-left text-sm hover:bg-muted/40 ${className ?? "rounded-xl border border-border"}`}
        >
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {label}
          </span>
          <span className="font-medium text-foreground">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={disabledBefore ? { before: disabledBefore } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
}
