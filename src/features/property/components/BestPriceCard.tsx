import {
  BedDouble,
  Check,
  CreditCard,
  ShieldCheck,
  Users,
  Utensils,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BestPriceCardProps {
  roomName?: string | null;
  roomTypeLabel?: string | null;
  boardBasis?: string | null;
  refundable?: boolean | null;
  maxGuests?: number | null;
  bedSummary?: string | null;
  imageUrl?: string | null;
  includes?: string[] | null;
  views?: string[] | null;
  areaLabel?: string | null;
  priceLabel: string | null;
  onScrollToRooms?: () => void;
}

export function BestPriceCard({
  roomName,
  boardBasis,
  refundable,
  maxGuests,
  bedSummary,
  imageUrl,
  includes,
  views,
  areaLabel,
  priceLabel,
  onScrollToRooms,
}: BestPriceCardProps) {
  const hasSelection = Boolean(roomName && priceLabel);
  const hasBreakfast = /breakfast|bb|half.?board|full.?board/i.test(
    boardBasis ?? ""
  );

  const banner = hasSelection
    ? hasBreakfast
      ? "Best price with breakfast"
      : "Your selected rate"
    : "Today's best price";

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="bg-emerald-50 px-4 py-2.5 text-center text-sm font-semibold text-emerald-800">
        {banner}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {hasSelection ? (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {priceLabel}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Total for stay · taxes may apply
              </p>
            </div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt=""
                className="size-[4.5rem] shrink-0 rounded-lg object-cover ring-1 ring-border/60"
              />
            ) : null}
          </div>
        ) : (
          <div>
            <p className="text-lg font-semibold text-foreground">
              Compare rooms below
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tap Reserve on a rate to go straight to checkout.
            </p>
          </div>
        )}

        {hasSelection ? (
          <div className="space-y-2.5 border-t border-border/70 pt-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              {roomName}
              {maxGuests ? (
                <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                  {Array.from({ length: Math.min(maxGuests, 4) }).map((_, i) => (
                    <Users key={i} className="size-3.5" />
                  ))}
                </span>
              ) : null}
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              {bedSummary ? (
                <li className="flex items-start gap-2">
                  <BedDouble className="mt-0.5 size-4 shrink-0" />
                  {bedSummary}
                </li>
              ) : null}
              {areaLabel ? (
                <li className="text-xs text-muted-foreground">{areaLabel}</li>
              ) : null}
              {views?.length ? (
                <li className="text-xs text-muted-foreground">
                  {views.join(", ")}
                </li>
              ) : null}
              {hasBreakfast ? (
                <li className="flex items-start gap-2 text-emerald-700">
                  <Utensils className="mt-0.5 size-4 shrink-0" />
                  {boardBasis}
                </li>
              ) : (
                <li className="flex items-start gap-2">
                  <Utensils className="mt-0.5 size-4 shrink-0" />
                  {boardBasis || "Room only"}
                </li>
              )}
              {(includes ?? []).map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-emerald-700"
                >
                  <Check className="mt-0.5 size-4 shrink-0" />
                  {item}
                </li>
              ))}
              <li
                className={cn(
                  "flex items-start gap-2",
                  refundable ? "text-emerald-700" : "text-muted-foreground"
                )}
              >
                {refundable ? (
                  <Check className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0" />
                )}
                {refundable ? "Free cancellation" : "Non-refundable"}
              </li>
              <li className="flex items-start gap-2 text-emerald-700">
                <Zap className="mt-0.5 size-4 shrink-0" />
                Instant confirmation
              </li>
              <li className="flex items-start gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0" />
                Prepay online
              </li>
            </ul>
          </div>
        ) : null}

        <Button
          className="w-full"
          size="lg"
          type="button"
          onClick={onScrollToRooms}
        >
          More options
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-700">
          <ShieldCheck className="size-3.5" />
          Secure booking · live price check
        </p>
      </div>
    </div>
  );
}
