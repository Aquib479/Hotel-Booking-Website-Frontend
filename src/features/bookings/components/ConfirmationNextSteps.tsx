import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingDetail } from "../types";

interface ConfirmationNextStepsProps {
  booking: BookingDetail;
}

export function ConfirmationNextSteps({ booking }: ConfirmationNextStepsProps) {
  const { t } = useLanguage();
  const confirmText = booking.guest.email
    ? t("bookings.nextWhatsAppEmail")
    : t("bookings.nextWhatsApp");

  return (
    <SectionCard title={t("bookings.next")}>
      <ul className="space-y-3">
        <li className="flex gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check className="size-3 text-emerald-600" />
          </span>
          <span className="text-muted-foreground">{confirmText}</span>
        </li>
        <li className="flex gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check className="size-3 text-emerald-600" />
          </span>
          <span className="text-muted-foreground">
            {t("bookings.nextManage")}{" "}
            <Link to="/bookings" className="font-medium text-brand hover:underline">
              {t("bookings.title")}
            </Link>
          </span>
        </li>

        <li className="flex gap-3 text-sm">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <Check className="size-3 text-emerald-600" />
          </span>
          <div className="min-w-0 flex-1">
            <Accordion type="single" collapsible>
              <AccordionItem value="policy" className="border-none">
                <AccordionTrigger className="py-0 hover:no-underline">
                  <span className="text-left text-muted-foreground">
                    {t("bookings.cancellation")}{" "}
                    <span className="text-foreground">{booking.policy.headline}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-1.5 border-l-2 border-brand/20 pl-3 text-xs text-muted-foreground">
                    {booking.policy.bullets.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </li>
      </ul>
    </SectionCard>
  );
}
