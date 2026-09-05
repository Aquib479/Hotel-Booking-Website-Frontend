import { useCurrency } from "@/context/CurrencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CurrencyPreferenceSection() {
  const { t } = useLanguage();
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <SectionCard title={t("account.displayCurrency")} description={t("account.currencyHelper")}>
      <FormField label={t("account.preferredCurrency")} htmlFor="currency-select">
        <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
          <SelectTrigger id="currency-select" className="max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.symbol} {c.label} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </SectionCard>
  );
}
