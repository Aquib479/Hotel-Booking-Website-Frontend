export function BookingsLoadingSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading bookings">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col gap-4 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-start"
        >
          <div className="size-24 shrink-0 rounded-xl bg-muted sm:size-28" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="h-5 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="flex gap-2">
              <div className="h-5 w-20 rounded-full bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-12 w-full max-w-xs rounded-lg bg-muted" />
            <div className="flex justify-between">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="h-9 w-28 rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
