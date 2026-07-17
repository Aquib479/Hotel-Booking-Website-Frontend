import { cn } from "@/lib/utils";
import { FormField } from "@/components/common/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CANCEL_REASONS, SUPPORT_CONTACT_HREF } from "../constants";
import type { CancelReasonId } from "../types";

interface CancelReasonStepProps {
  selected: CancelReasonId | null;
  reasonDetail: string;
  onSelect: (reason: CancelReasonId) => void;
  onDetailChange: (value: string) => void;
}

export function CancelReasonStep({
  selected,
  reasonDetail,
  onSelect,
  onDetailChange,
}: CancelReasonStepProps) {
  const selectedConfig = CANCEL_REASONS.find((r) => r.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Why are you cancelling?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps us improve — your refund amount will be shown on the next step.
        </p>
      </div>

      <RadioGroup
        value={selected ?? ""}
        onValueChange={(v) => onSelect(v as CancelReasonId)}
        className="space-y-2"
      >
        {CANCEL_REASONS.map((option) => (
          <Label
            key={option.id}
            htmlFor={`cancel-reason-${option.id}`}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all",
              selected === option.id
                ? "border-brand bg-brand/5 shadow-sm"
                : "border-border bg-white hover:border-brand/40 hover:bg-muted/20"
            )}
          >
            <RadioGroupItem id={`cancel-reason-${option.id}`} value={option.id} />
            <span className="text-sm font-medium text-foreground">{option.label}</span>
          </Label>
        ))}
      </RadioGroup>

      {selectedConfig?.escalatesToSupport && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900">
          <AlertDescription>
            We&apos;re sorry to hear that — you may want to{" "}
            <a href={SUPPORT_CONTACT_HREF} className="font-medium underline">
              contact support
            </a>{" "}
            first. They may be able to help without cancelling.
          </AlertDescription>
        </Alert>
      )}

      {(selected === "other" || selected === "hotel_issue") && (
        <FormField
          label="Additional details"
          htmlFor="cancel-reason-detail"
          optional={selected === "hotel_issue"}
          required={selected === "other"}
        >
          <Textarea
            id="cancel-reason-detail"
            rows={3}
            value={reasonDetail}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder="Tell us a bit more…"
          />
        </FormField>
      )}
    </div>
  );
}
