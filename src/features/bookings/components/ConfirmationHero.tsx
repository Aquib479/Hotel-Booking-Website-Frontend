import { useCallback, useState } from "react";
import { CheckCircle, Copy, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BookingDetail } from "../types";
import type { ConfirmationPhase } from "../hooks/useBookingConfirmation";

function getHeadline(booking: BookingDetail): string {
  if (booking.lane === "wholesale") return "Your stay is confirmed.";
  if (booking.mode === "rest") return "Your rest slot is booked.";
  return "Your stay is booked.";
}

interface ConfirmationHeroProps {
  booking: BookingDetail;
  phase: ConfirmationPhase;
}

export function ConfirmationHero({ booking, phase }: ConfirmationHeroProps) {
  const [copied, setCopied] = useState(false);
  const isPending = phase === "confirming_payment";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(booking.confirmationCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [booking.confirmationCode]);

  return (
    <header className="text-center">
      <div
        className={cn(
          "mx-auto flex size-16 items-center justify-center rounded-full",
          isPending ? "bg-brand/10" : "bg-emerald-100"
        )}
      >
        {isPending ? (
          <Loader2 className="size-8 animate-spin text-brand" aria-hidden />
        ) : (
          <CheckCircle className="size-8 text-emerald-600" aria-hidden />
        )}
      </div>

      <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">
        {isPending ? "Confirming your payment…" : "You're all set!"}
      </h1>

      {!isPending && (
        <p className="mt-2 text-base text-muted-foreground">{getHeadline(booking)}</p>
      )}

      {isPending ? (
        <p className="mt-2 text-sm text-muted-foreground">
          This usually takes a few seconds. Please don&apos;t close this page.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          We&apos;ve sent the details to your WhatsApp
          {booking.guest.email ? " and email" : ""}.
        </p>
      )}

      <Card className="mx-auto mt-6 max-w-sm">
        <CardContent className="flex items-center gap-2">
          <div className="min-w-0 flex-1 text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Booking reference
            </p>
            <p className="font-mono text-lg font-semibold text-foreground">
              {booking.confirmationCode}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => void handleCopy()}
            disabled={isPending}
            aria-label={copied ? "Copied" : "Copy booking reference"}
          >
            {copied ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Copy className="size-4 text-muted-foreground" />
            )}
          </Button>
        </CardContent>
      </Card>
    </header>
  );
}
