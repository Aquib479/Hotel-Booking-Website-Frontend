import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface FaqNoResultsStateProps {
  query: string;
}

export function FaqNoResultsState({ query }: FaqNoResultsStateProps) {
  const { t } = useLanguage();

  return (
    <Alert className="border-dashed py-8">
      <AlertTitle>{t("support.faqNone")}</AlertTitle>
      <AlertDescription className="space-y-4">
        {query ? <p>{t("support.faqNoQuery", { q: query })}</p> : <p>{t("support.faqNoneHint")}</p>}
        <Button variant="brand" asChild>
          <Link to="/contact">
            <MessageCircle className="size-4" />
            {t("bookings.contactSupport")}
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
