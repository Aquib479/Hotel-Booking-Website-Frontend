import { format, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";

interface DirectCancelEligibilityProps {
  cancelCutoffTime: string;
}

export function DirectCancelEligibility({ cancelCutoffTime }: DirectCancelEligibilityProps) {
  const cutoff = parseISO(cancelCutoffTime);
  const cutoffLabel = format(cutoff, "h:mm a 'on' EEE, MMM d");

  return (
    <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Clock className="size-5 shrink-0" aria-hidden />
      <div>
        <p className="font-medium">Cancellation no longer available</p>
        <p className="mt-1 text-amber-800">
          Free cancellation was available until {cutoffLabel} ({DIRECT_CANCEL_HOURS_BEFORE_SLOT}{" "}
          hours before your slot). Contact support if you need urgent help.
        </p>
      </div>
    </div>
  );
}
