import { cn } from "@/lib/utils";
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

      <fieldset className="space-y-2">
        <legend className="sr-only">Cancellation reason</legend>
        {CANCEL_REASONS.map((option) => (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
              selected === option.id
                ? "border-brand bg-brand/5"
                : "border-border hover:border-brand/40"
            )}
          >
            <input
              type="radio"
              name="cancel-reason"
              value={option.id}
              checked={selected === option.id}
              onChange={() => onSelect(option.id)}
              className="accent-brand"
            />
            <span className="text-sm font-medium text-foreground">{option.label}</span>
          </label>
        ))}
      </fieldset>

      {selectedConfig?.escalatesToSupport && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          We&apos;re sorry to hear that — you may want to{" "}
          <a href={SUPPORT_CONTACT_HREF} className="font-medium underline">
            contact support
          </a>{" "}
          first. They may be able to help without cancelling.
        </div>
      )}

      {(selected === "other" || selected === "hotel_issue") && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Additional details {selected === "other" ? "(required)" : "(optional)"}
          </label>
          <textarea
            rows={3}
            value={reasonDetail}
            onChange={(e) => onDetailChange(e.target.value)}
            placeholder="Tell us a bit more…"
            className="w-full resize-none rounded-xl border border-border px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
      )}
    </div>
  );
}
