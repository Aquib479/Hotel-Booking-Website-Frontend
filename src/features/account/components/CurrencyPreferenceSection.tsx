import { useCurrency } from "@/context/CurrencyContext";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_HELPER_TEXT } from "../constants";

export function CurrencyPreferenceSection() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <SectionCard title="Display currency" description={CURRENCY_HELPER_TEXT}>
      <FormField label="Preferred currency" htmlFor="currency-select">
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
