import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarDays, Users } from "lucide-react";
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
import { GUEST_OPTIONS } from "../data";
import { useBookingPricing } from "../hooks/useBookingPricing";
import type { BookingState } from "../types";

interface BookingSidebarProps {
  propertyId: string;
  pricePerNight: number;
  initialBooking?: Partial<BookingState>;
}

export function BookingSidebar({
  propertyId,
  pricePerNight,
  initialBooking,
}: BookingSidebarProps) {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingState>({
    checkIn: initialBooking?.checkIn ?? new Date(2024, 0, 5),
    checkOut: initialBooking?.checkOut ?? new Date(2024, 0, 12),
    guests: initialBooking?.guests ?? "4 adults",
  });

  const pricing = useBookingPricing(pricePerNight, booking);
  const formatDate = (date?: Date) => (date ? format(date, "MMM. d, yyyy") : "Select");

  const handleCheckout = () => {
    const params = new URLSearchParams({
      propertyId,
      guests: booking.guests,
      ...(booking.checkIn && { checkIn: booking.checkIn.toISOString() }),
      ...(booking.checkOut && { checkOut: booking.checkOut.toISOString() }),
    });
    navigate(`/checkout?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-lg shadow-black/5">
        <div className="mb-4">
          <p className="text-2xl font-bold text-foreground">
            ${pricePerNight}
            <span className="text-base font-normal text-muted-foreground">/night</span>
          </p>
          <p className="text-xs text-muted-foreground">Total before taxes</p>
        </div>

        <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-xl border border-border">
          <DateField
            label="Check-in"
            value={formatDate(booking.checkIn)}
            selected={booking.checkIn}
            onSelect={(checkIn) => setBooking((b) => ({ ...b, checkIn }))}
          />
          <DateField
            label="Check-out"
            value={formatDate(booking.checkOut)}
            selected={booking.checkOut}
            onSelect={(checkOut) => setBooking((b) => ({ ...b, checkOut }))}
            disabledBefore={booking.checkIn}
            className="border-l border-border"
          />
        </div>

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
              Rental price (${pricePerNight}/day x {pricing.nights} days)
            </span>
            <span>${pricing.rentalTotal.toLocaleString()}</span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-rose-500">
              <span>5+ day discount (Extended trip discount 5%)</span>
              <span>-${pricing.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Refundable deposit (Refunded by Oct 14th)</span>
            <span>${pricing.deposit.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground">
            <span>Total Price Due</span>
            <span>${pricing.totalDue.toLocaleString()}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            * Your total rent amount will be calculated depending on the check-in and check-out
            dates.
          </p>
        </div>

        <Button
          onClick={handleCheckout}
          className="mt-5 h-12 w-full rounded-xl bg-brand text-base font-semibold text-white hover:bg-brand/90"
        >
          Continue to checkout
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
          className={`flex w-full flex-col items-start px-4 py-3 text-left text-sm hover:bg-muted/40 ${className ?? ""}`}
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
