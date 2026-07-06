export function BookingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6 px-4 py-8 sm:px-8" aria-busy="true">
      <div className="h-4 w-32 rounded bg-muted" />
      <div className="h-8 w-2/3 rounded bg-muted" />
      <div className="h-16 rounded-xl bg-muted" />
      <div className="rounded-2xl border border-border p-5">
        <div className="flex gap-4">
          <div className="size-20 rounded-xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-4 h-14 rounded-lg bg-muted" />
      </div>
      <div className="h-32 rounded-xl bg-muted" />
      <div className="h-24 rounded-xl bg-muted" />
      <div className="h-12 rounded-xl bg-muted" />
    </div>
  );
}
