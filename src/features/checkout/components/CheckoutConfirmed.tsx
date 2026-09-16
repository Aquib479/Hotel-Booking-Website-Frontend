import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Check, CheckCircle, Copy } from "lucide-react";
import { formatPrice } from "@/lib/currency/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionCard } from "@/components/common/SectionCard";
import { useLanguage } from "@/context/LanguageContext";
import { getSlotWindowLabel } from "../constants";
import type { ConfirmedCheckoutSnapshot } from "../types";

interface CheckoutConfirmedProps {
  snapshot: ConfirmedCheckoutSnapshot;
}

function formatStaySummary(
  snapshot: ConfirmedCheckoutSnapshot,
  language: "en" | "id",
  t: (key: string, vars?: Record<string, string | number>) => string,
): string {
  if (snapshot.mode === "rest" && snapshot.slotDate && snapshot.slotWindow) {
    return `${snapshot.slotDate} · ${getSlotWindowLabel(snapshot.slotWindow, language)}`;
  }
  if (snapshot.checkIn && snapshot.checkOut) {
    const nights =
      snapshot.nights != null && snapshot.nights > 0
        ? snapshot.nights === 1
          ? ` · ${t("common.nightOne")}`
          : ` · ${t("common.nightsN", { n: snapshot.nights })}`
        : "";
    return `${snapshot.checkIn} → ${snapshot.checkOut}${nights}`;
  }
  return snapshot.guestsLabel;
}

export function CheckoutConfirmed({ snapshot }: CheckoutConfirmedProps) {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const reference = snapshot.confirmationCode || snapshot.bookingId;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [reference]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="size-8 text-emerald-600" aria-hidden />
        </div>
        <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">{t("bookings.allSet")}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          {snapshot.mode === "rest" ? t("bookings.confirmedSlot") : t("bookings.confirmedStayBooked")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{t("bookings.sentWhatsAppEmail")}</p>

        <Card className="mx-auto mt-6 max-w-sm">
          <CardContent className="flex items-center gap-2">
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("bookings.reference")}
              </p>
              <p className="font-mono text-lg font-semibold text-foreground">{reference}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => void handleCopy()}
              aria-label={copied ? t("common.copied") : t("bookings.copyRef")}
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

      <SectionCard title={t("bookings.summary")}>
        <div className="flex gap-4">
          {snapshot.hotelImageUrl ? (
            <img
              src={snapshot.hotelImageUrl}
              alt=""
              className="size-20 shrink-0 rounded-lg object-cover"
            />
          ) : null}
          <div className="min-w-0 flex-1 space-y-1">
            <p className="font-semibold text-foreground">{snapshot.hotelName}</p>
            {snapshot.roomName ? (
              <p className="text-sm text-muted-foreground">{snapshot.roomName}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">{formatStaySummary(snapshot, language, t)}</p>
            <p className="text-sm text-muted-foreground">{snapshot.guestsLabel}</p>
            <p className="text-sm text-muted-foreground">
              {t("checkout.guestLine", { name: snapshot.guestName, email: snapshot.guestEmail })}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{t("bookings.amountPaid")}</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(snapshot.totalPrice, snapshot.currency)}
          </span>
        </div>
      </SectionCard>

      <SectionCard title={t("bookings.next")}>
        <ul className="space-y-3">
          <li className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-3 text-emerald-600" />
            </span>
            {t("bookings.nextWhatsAppEmail")}
          </li>
          <li className="flex gap-3 text-sm text-muted-foreground">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Check className="size-3 text-emerald-600" />
            </span>
            <span>
              {t("bookings.nextManage")}{" "}
              <Link to="/bookings" className="font-medium text-brand hover:underline">
                {t("bookings.title")}
              </Link>
            </span>
          </li>
        </ul>
      </SectionCard>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="brand" size="lg" className="h-12 flex-1">
          <Link to={`/bookings/${snapshot.bookingId}`}>{t("bookings.view")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 flex-1">
          <Link to="/">{t("checkout.backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
