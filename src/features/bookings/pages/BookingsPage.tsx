import { Button } from "@/components/ui/button";
import { BookingsPageLayout } from "../components/BookingsPageLayout";
import { BookingCard } from "../components/BookingCard";
import { BookingsEmptyState } from "../components/BookingsEmptyState";
import { BookingsLoadingSkeleton } from "../components/BookingsLoadingSkeleton";
import { useBookingFilters } from "../hooks/useBookingFilters";
import { useBookingsList } from "../hooks/useBookingsList";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { BOOKINGS_PER_PAGE } from "../constants";

export function BookingsPage() {
  const { isAuthenticated } = useRequireAuth("/bookings");
  const { filters, setStatus, setLane, setSearch, setPage } = useBookingFilters();
  const { bookings, total, counts, isLoading, error } = useBookingsList(filters);

  if (!isAuthenticated) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(total / BOOKINGS_PER_PAGE));

  return (
    <BookingsPageLayout
      total={total}
      status={filters.status}
      counts={counts}
      search={filters.search}
      lane={filters.lane}
      onStatusChange={setStatus}
      onSearchChange={setSearch}
      onLaneChange={setLane}
      pagination={
        totalPages > 1 ? (
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={filters.page <= 1}
              onClick={() => setPage(filters.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {filters.page} of {totalPages}
            </span>
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={filters.page >= totalPages}
              onClick={() => setPage(filters.page + 1)}
            >
              Next
            </Button>
          </div>
        ) : undefined
      }
    >
      {isLoading && <BookingsLoadingSkeleton />}

      {!isLoading && error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!isLoading && !error && bookings.length === 0 && (
        <BookingsEmptyState status={filters.status} />
      )}

      {!isLoading &&
        !error &&
        bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
    </BookingsPageLayout>
  );
}
