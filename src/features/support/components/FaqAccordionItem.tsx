import { useLanguage } from "@/context/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { FaqItem } from "../types";

interface FaqAccordionItemProps {
  item: FaqItem;
  defaultOpen?: boolean;
}

export function FaqAccordionItem({ item, defaultOpen = false }: FaqAccordionItemProps) {
  const { t } = useLanguage();
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? item.id : undefined}
      className="rounded-xl border bg-card px-4"
    >
      <AccordionItem value={item.id} className="border-0">
        <AccordionTrigger className="py-4 font-semibold hover:no-underline">
          {item.question}
        </AccordionTrigger>
        <AccordionContent className="space-y-3 pb-4 text-muted-foreground">
          <p>{item.answer}</p>

          {item.laneAnswers && (
            <div className="space-y-2 rounded-lg bg-muted/50 p-3">
              {item.laneAnswers.direct && (
                <div>
                  <Badge variant="brand" className="mb-1">
                    {t("common.exclusive")}
                  </Badge>
                  <p className="text-sm">{item.laneAnswers.direct}</p>
                </div>
              )}
              {item.laneAnswers.wholesale && (
                <div>
                  <Badge variant="secondary" className="mb-1">
                    {t("common.partnerRate")}
                  </Badge>
                  <p className="text-sm">{item.laneAnswers.wholesale}</p>
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
