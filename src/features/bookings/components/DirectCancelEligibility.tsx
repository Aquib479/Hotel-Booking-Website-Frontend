import { format, parseISO } from "date-fns";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";

interface DirectCancelEligibilityProps {
  cancelCutoffTime: string;
}

export function DirectCancelEligibility({ cancelCutoffTime }: DirectCancelEligibilityProps) {
  const cutoff = parseISO(cancelCutoffTime);
  const cutoffLabel = format(cutoff, "h:mm a 'on' EEE, MMM d");

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
      <Clock className="text-amber-700" />
      <AlertTitle>Cancellation no longer available</AlertTitle>
      <AlertDescription className="text-amber-800">
        Free cancellation was available until {cutoffLabel} ({DIRECT_CANCEL_HOURS_BEFORE_SLOT}{" "}
        hours before your slot). Contact support if you need urgent help.
      </AlertDescription>
    </Alert>
  );
}
