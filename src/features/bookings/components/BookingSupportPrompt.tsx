import { SUPPORT_CONTACT_HREF } from "../constants";

interface BookingSupportPromptProps {
  confirmationCode: string;
}

export function BookingSupportPrompt({ confirmationCode }: BookingSupportPromptProps) {
  return (
    <footer className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-4 text-center text-sm">
      <p className="text-muted-foreground">
        Need help with this booking?{" "}
        <a
          href={`${SUPPORT_CONTACT_HREF}&body=Booking%20${encodeURIComponent(confirmationCode)}`}
          className="font-medium text-brand hover:underline"
        >
          Contact support
        </a>
      </p>
    </footer>
  );
}
