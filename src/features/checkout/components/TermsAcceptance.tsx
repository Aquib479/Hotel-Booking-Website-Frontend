import { Link } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface TermsAcceptanceProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function TermsAcceptance({ checked, onChange }: TermsAcceptanceProps) {
  const { t } = useLanguage();

  return (
    <Label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border bg-card p-4 font-normal"
      )}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
        className="mt-0.5"
      />
      <span className="text-sm text-muted-foreground">
        {t("checkout.termsAgree")}{" "}
        <Link to="/terms" className="font-medium text-brand hover:underline" target="_blank">
          {t("footer.terms")}
        </Link>{" "}
        {t("checkout.and")}{" "}
        <Link
          to="/cancellation-policy"
          className="font-medium text-brand hover:underline"
          target="_blank"
        >
          {t("footer.cancellation")}
        </Link>
      </span>
    </Label>
  );
}
