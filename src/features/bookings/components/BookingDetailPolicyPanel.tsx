import { SectionCard } from "@/components/common/SectionCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { BookingPolicySnapshot } from "../types";

interface BookingDetailPolicyPanelProps {
  policy: BookingPolicySnapshot;
  lockedAtBooking?: boolean;
}

export function BookingDetailPolicyPanel({
  policy,
  lockedAtBooking = true,
}: BookingDetailPolicyPanelProps) {
  return (
    <SectionCard
      title="Cancellation policy"
      description={lockedAtBooking ? "As agreed at time of booking" : undefined}
      contentClassName="pt-0"
      size="sm"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="policy" className="border-none">
          <AccordionTrigger className="py-0 hover:no-underline">
            <span className="text-sm text-muted-foreground">{policy.headline}</span>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {policy.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-brand">•</span>
                  {line}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionCard>
  );
}
