import { SUPPORT_CONTACT_HREF } from "../constants";
import { Card, CardContent } from "@/components/ui/card";

interface BookingSupportPromptProps {
  confirmationCode: string;
}

export function BookingSupportPrompt({ confirmationCode }: BookingSupportPromptProps) {
  return (
    <Card className="border-dashed bg-muted/20">
      <CardContent className="text-center text-sm">
        <p className="text-muted-foreground">
          Need help with this booking?{" "}
          <a
            href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(confirmationCode)}`}
            className="font-medium text-brand hover:underline"
          >
            Contact support
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
