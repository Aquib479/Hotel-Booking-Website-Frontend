import { Link } from "react-router-dom";
import type { BookingLane } from "@/lib/booking/types";
import { getCancellationPolicySummary } from "@/features/support/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface CancellationPolicySummaryProps {
  lane: BookingLane;
  supplierName?: string;
}

export function CancellationPolicySummary({ lane, supplierName }: CancellationPolicySummaryProps) {
  const { language, t } = useLanguage();
  const { headline, bullets } = getCancellationPolicySummary(lane, supplierName, language);

  return (
    <Card className="rounded-xl shadow-xs">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">{t("bookings.policy")}</CardTitle>
        <p className="text-sm text-muted-foreground">{headline}</p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="policy" className="border-0">
            <AccordionTrigger className="py-2 text-sm text-brand hover:no-underline">
              {t("checkout.viewPolicy")}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {bullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-brand">•</span>
                    {line}
                  </li>
                ))}
                <li className="pt-1">
                  <Link to="/cancellation-policy" className="font-medium text-brand hover:underline">
                    {t("checkout.readPolicy")}
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
