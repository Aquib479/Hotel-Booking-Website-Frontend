import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingTabStatus } from "../types";

interface BookingsEmptyStateProps {
  status: BookingTabStatus;
}

export function BookingsEmptyState({ status }: BookingsEmptyStateProps) {
  const { t } = useLanguage();
  const copy = {
    upcoming: {
      title: t("bookings.emptyUpcomingTitle"),
      body: t("bookings.emptyUpcomingBody"),
      cta: { label: t("bookings.searchHotels"), href: "/search" },
    },
    past: {
      title: t("bookings.emptyPastTitle"),
      body: t("bookings.emptyPastBody"),
    },
    cancelled: {
      title: t("bookings.emptyCancelledTitle"),
      body: t("bookings.emptyCancelledBody"),
    },
  }[status];

  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-foreground">{copy.title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{copy.body}</p>
      {"cta" in copy && copy.cta && (
        <Button asChild className="mt-6 rounded-xl">
          <Link to={copy.cta.href}>{copy.cta.label}</Link>
        </Button>
      )}
    </div>
  );
}
