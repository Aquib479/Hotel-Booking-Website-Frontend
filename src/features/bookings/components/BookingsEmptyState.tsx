import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { BookingTabStatus } from "../types";

interface BookingsEmptyStateProps {
  status: BookingTabStatus;
}

const COPY: Record<
  BookingTabStatus,
  { title: string; body: string; cta?: { label: string; href: string } }
> = {
  upcoming: {
    title: "No upcoming bookings",
    body: "Find your next rest stop — 12-hour slots and overnight stays near airports worldwide.",
    cta: { label: "Search hotels", href: "/search" },
  },
  past: {
    title: "No past bookings yet",
    body: "Your completed stays and rest slots will show up here.",
  },
  cancelled: {
    title: "No cancelled bookings",
    body: "Cancelled or refunded bookings will appear here if you have any.",
  },
};

export function BookingsEmptyState({ status }: BookingsEmptyStateProps) {
  const copy = COPY[status];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{copy.body}</p>
      {copy.cta && (
        <Button asChild className="mt-6 rounded-xl">
          <Link to={copy.cta.href}>{copy.cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
