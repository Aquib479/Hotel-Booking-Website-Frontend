import type { ReactNode } from "react";
import { BookingStatusTabs } from "./BookingStatusTabs";
import { BookingsSearchAndFilter } from "./BookingsSearchAndFilter";
import type { BookingTabStatus } from "../types";
import { useLanguage } from "@/context/LanguageContext";

interface BookingsPageLayoutProps {
  total: number;
  status: BookingTabStatus;
  counts: Record<BookingTabStatus, number>;
  search: string;
  onStatusChange: (status: BookingTabStatus) => void;
  onSearchChange: (search: string) => void;
  children: ReactNode;
  pagination?: ReactNode;
}

export function BookingsPageLayout({
  total,
  status,
  counts,
  search,
  onStatusChange,
  onSearchChange,
  children,
  pagination,
}: BookingsPageLayoutProps) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{t("bookings.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total > 0
            ? total === 1
              ? t("bookings.countOne")
              : t("bookings.countMany", { n: total })
            : t("bookings.subtitle")}
        </p>
      </header>

      <BookingStatusTabs active={status} counts={counts} onChange={onStatusChange} />

      <div className="mt-6">
        <BookingsSearchAndFilter search={search} onSearchChange={onSearchChange} />
      </div>

      <div className="mt-6 space-y-4">{children}</div>

      {pagination && <div className="mt-8">{pagination}</div>}
    </div>
  );
}
