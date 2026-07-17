import { ExternalLink } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface WholesaleHandoffNoticeProps {
  supplierName?: string;
  onContinue: () => void;
  isSubmitting: boolean;
  disabled: boolean;
  disabledReason?: string;
}

export function WholesaleHandoffNotice({
  supplierName,
  onContinue,
  isSubmitting,
  disabled,
  disabledReason,
}: WholesaleHandoffNoticeProps) {
  const partner = supplierName ?? "our partner";

  return (
    <SectionCard title="Partner booking" description="Payment is completed with the hotel supplier">
      <Alert>
        <ExternalLink className="size-5" />
        <AlertDescription>
          <p className="font-medium text-foreground">
            You&apos;ll complete this booking with {partner}
          </p>
          <p className="mt-2">
            Your details and price are locked in — you won&apos;t need to search again.
            RestHalf hands off to the supplier to finalize payment and confirmation.
          </p>
        </AlertDescription>
      </Alert>

      <Button
        type="button"
        variant="brand"
        size="lg"
        onClick={onContinue}
        disabled={disabled || isSubmitting}
        title={disabled ? disabledReason : undefined}
        className="mt-4 hidden h-12 w-full lg:flex"
      >
        {isSubmitting ? "Preparing handoff…" : "Continue to complete booking"}
      </Button>
    </SectionCard>
  );
}
