import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ToggleFieldProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function ToggleField({
  label,
  description,
  checked,
  disabled,
  onChange,
  id,
}: ToggleFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <Label
      htmlFor={fieldId}
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border px-4 py-3 font-normal",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Checkbox
        id={fieldId}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5"
      />
    </Label>
  );
}
