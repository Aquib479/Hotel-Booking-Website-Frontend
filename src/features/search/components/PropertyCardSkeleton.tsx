import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <Skeleton className="aspect-[5/3] w-full rounded-none" />
      <div className="space-y-2 p-2.5">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-3 w-[60%]" />
        <Skeleton className="h-4 w-[33%]" />
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}
