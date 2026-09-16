import { SUPPORT_CONTACT_HREF } from "../constants";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface BookingSupportPromptProps {
  confirmationCode: string;
}

export function BookingSupportPrompt({ confirmationCode }: BookingSupportPromptProps) {
  const { t } = useLanguage();
  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="text-center text-sm">
        <p className="text-muted-foreground">
          {t("bookings.needHelp")}{" "}
          <a
            href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(confirmationCode)}`}
            className="font-medium text-brand hover:underline"
          >
            {t("bookings.contactSupport")}
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
