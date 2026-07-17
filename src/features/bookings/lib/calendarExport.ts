import { addDays, format, parseISO } from "date-fns";
import type { BookingDetail } from "../types";
import { getSlotWindowLabel } from "@/features/checkout/constants";

function formatIcsDate(date: Date): string {
  return format(date, "yyyyMMdd'T'HHmmss");
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function restSlotBounds(
  slotDate: string,
  slotWindow: NonNullable<BookingDetail["slotWindow"]>
): { start: Date; end: Date } {
  const day = parseISO(slotDate);
  const y = day.getFullYear();
  const m = day.getMonth();
  const d = day.getDate();

  switch (slotWindow) {
    case "00-12":
      return {
        start: new Date(y, m, d, 0, 0, 0),
        end: new Date(y, m, d, 12, 0, 0),
      };
    case "12-24":
      return {
        start: new Date(y, m, d, 12, 0, 0),
        end: new Date(y, m, d + 1, 0, 0, 0),
      };
    case "24h":
      return {
        start: new Date(y, m, d, 0, 0, 0),
        end: new Date(y, m, d + 1, 0, 0, 0),
      };
    default:
      return { start: day, end: addDays(day, 1) };
  }
}

export function buildBookingCalendarEvent(booking: BookingDetail): {
  filename: string;
  content: string;
} {
  let start: Date;
  let end: Date;
  let summary: string;

  if (booking.mode === "rest" && booking.slotDate && booking.slotWindow) {
    ({ start, end } = restSlotBounds(booking.slotDate, booking.slotWindow));
    summary = `${booking.hotelName} — Rest slot (${getSlotWindowLabel(booking.slotWindow)})`;
  } else if (booking.checkIn && booking.checkOut) {
    start = parseISO(booking.checkIn);
    end = parseISO(booking.checkOut);
    summary = `${booking.hotelName} — Hotel stay`;
  } else {
    start = new Date();
    end = addDays(start, 1);
    summary = booking.hotelName;
  }

  const description = [
    `RestHalf confirmation: ${booking.confirmationCode}`,
    booking.payment.supplierBookingRef
      ? `Supplier reference: ${booking.payment.supplierBookingRef}`
      : null,
    booking.address,
  ]
    .filter(Boolean)
    .join("\n");

  const uid = `${booking.id}@resthalf.com`;
  const now = formatIcsDate(new Date());

  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RestHalf//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(booking.address)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return {
    filename: `resthalf-${booking.confirmationCode}.ics`,
    content,
  };
}

export function downloadBookingCalendarEvent(booking: BookingDetail): void {
  const { filename, content } = buildBookingCalendarEvent(booking);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
