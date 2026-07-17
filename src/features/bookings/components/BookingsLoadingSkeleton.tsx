import { Card } from "@/components/ui/card";
import { CardImageRow } from "@/components/common/CardImageRow";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingsLoadingSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading bookings">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} padding="none">
          <CardImageRow
            image={<Skeleton className="aspect-square w-full rounded-xl sm:min-h-[8.5rem]" />}
          >
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full max-w-xs rounded-lg" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </CardImageRow>
        </Card>
      ))}
    </div>
  );
}
