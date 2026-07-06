import type { ReactNode } from "react";
import { BookingStatusTabs } from "./BookingStatusTabs";
import { BookingsSearchAndFilter } from "./BookingsSearchAndFilter";
import type { BookingTabStatus, LaneFilter } from "../types";

interface BookingsPageLayoutProps {
  total: number;
  status: BookingTabStatus;
  counts: Record<BookingTabStatus, number>;
  search: string;
  lane: LaneFilter;
  onStatusChange: (status: BookingTabStatus) => void;
  onSearchChange: (search: string) => void;
  onLaneChange: (lane: LaneFilter) => void;
  children: ReactNode;
  pagination?: ReactNode;
}

export function BookingsPageLayout({
  total,
  status,
  counts,
  search,
  lane,
  onStatusChange,
  onSearchChange,
  onLaneChange,
  children,
  pagination,
}: BookingsPageLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total > 0
            ? `${total} booking${total !== 1 ? "s" : ""} in this view`
            : "Manage upcoming rest slots and stays"}
        </p>
      </header>

      <BookingStatusTabs active={status} counts={counts} onChange={onStatusChange} />

      <div className="mt-6">
        <BookingsSearchAndFilter
          search={search}
          lane={lane}
          onSearchChange={onSearchChange}
          onLaneChange={onLaneChange}
        />
      </div>

      <div className="mt-6 space-y-4">{children}</div>

      {pagination && <div className="mt-8">{pagination}</div>}
    </div>
  );
}
