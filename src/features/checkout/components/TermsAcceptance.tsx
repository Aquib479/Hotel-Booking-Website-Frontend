interface TermsAcceptanceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TermsAcceptance({ checked, onChange }: TermsAcceptanceProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-4 rounded border-border accent-brand"
      />
      <span className="text-sm text-muted-foreground">
        I agree to the{" "}
        <a href="#" className="font-medium text-brand hover:underline" target="_blank" rel="noreferrer">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-brand hover:underline" target="_blank" rel="noreferrer">
          Cancellation Policy
        </a>
      </span>
    </label>
  );
}
