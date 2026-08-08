import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-border/70 bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="aspect-[16/11] w-full rounded-none sm:min-h-[232px] sm:w-[260px] sm:aspect-auto md:w-[288px]" />
        <div className="flex min-h-[232px] flex-1 flex-col sm:flex-row">
          <div className="flex-1 space-y-3 p-4 sm:px-5 sm:py-5">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-32" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-7 w-14 rounded-full" />
              <Skeleton className="h-7 w-14 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="flex w-full flex-col justify-between gap-4 border-t border-dashed border-border/80 p-4 sm:w-[188px] sm:border-l sm:border-t-0 sm:bg-slate-50/50 sm:px-4 sm:py-5 md:w-[200px]">
            <Skeleton className="ml-auto h-11 w-24 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="ml-auto h-7 w-28" />
              <Skeleton className="ml-auto h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
