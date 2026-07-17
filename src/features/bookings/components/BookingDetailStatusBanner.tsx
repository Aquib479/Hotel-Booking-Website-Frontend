import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { StatusBannerMessage } from "../statusMessage";

interface BookingDetailStatusBannerProps {
  banner: StatusBannerMessage;
}

const TONE_STYLES: Record<StatusBannerMessage["tone"], string> = {
  info: "border-brand/30 bg-brand/5 text-foreground",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  muted: "border-border bg-muted/40 text-muted-foreground",
};

export function BookingDetailStatusBanner({ banner }: BookingDetailStatusBannerProps) {
  return (
    <Alert className={cn(TONE_STYLES[banner.tone])} role="status">
      <AlertDescription className="font-medium">{banner.message}</AlertDescription>
    </Alert>
  );
}
