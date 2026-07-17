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

interface CancellationPolicySummaryProps {
  lane: BookingLane;
  supplierName?: string;
}

export function CancellationPolicySummary({ lane, supplierName }: CancellationPolicySummaryProps) {
  const { headline, bullets } = getCancellationPolicySummary(lane, supplierName);

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm">Cancellation policy</CardTitle>
        <p className="text-sm text-muted-foreground">{headline}</p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="policy" className="border-0">
            <AccordionTrigger className="py-2 text-sm text-brand hover:no-underline">
              View full policy details
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
                    Read full cancellation policy
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
