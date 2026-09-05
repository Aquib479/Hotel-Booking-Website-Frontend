import { format, parseISO } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import { Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";
import { useLanguage } from "@/context/LanguageContext";

interface DirectCancelEligibilityProps {
  cancelCutoffTime: string;
}

export function DirectCancelEligibility({ cancelCutoffTime }: DirectCancelEligibilityProps) {
  const { language, t } = useLanguage();
  const cutoff = parseISO(cancelCutoffTime);
  const cutoffLabel = format(cutoff, "h:mm a, EEE, MMM d", {
    locale: language === "id" ? idLocale : enUS,
  });

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
      <Clock className="text-amber-700" />
      <AlertTitle>{t("bookings.cancelUnavailable")}</AlertTitle>
      <AlertDescription className="text-amber-800">
        {t("bookings.cancelCutoff", {
          time: cutoffLabel,
          hours: DIRECT_CANCEL_HOURS_BEFORE_SLOT,
        })}
      </AlertDescription>
    </Alert>
  );
}
