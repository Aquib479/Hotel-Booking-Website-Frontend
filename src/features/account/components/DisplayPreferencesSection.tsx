import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { isAppLanguage } from "@/lib/i18n/languages";
import { LANGUAGE_OPTIONS, PRICE_DISPLAY_OPTIONS } from "../constants";
import type { LanguagePreference, MemberProfileDetails, PriceDisplayMode } from "../types";

interface DisplayPreferencesSectionProps {
  member: MemberProfileDetails;
  onChange: (patch: Partial<MemberProfileDetails>) => void;
}

export function DisplayPreferencesSection({ member, onChange }: DisplayPreferencesSectionProps) {
  const { t, setLanguage } = useLanguage();
  return (
    <SectionCard
      title={t("account.display")}
      description={t("account.displayHint")}
    >
      <div className="space-y-4">
        <FormField label={t("account.language")} htmlFor="pref-language">
          <Select
            value={member.language}
            onValueChange={(v) => {
              const next = v as LanguagePreference;
              onChange({ language: next });
              if (isAppLanguage(next)) setLanguage(next);
            }}
          >
            <SelectTrigger id="pref-language" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label={t("account.priceDisplay")} htmlFor="pref-price-display">
          <Select
            value={member.priceDisplay}
            onValueChange={(v) => onChange({ priceDisplay: v as PriceDisplayMode })}
          >
            <SelectTrigger id="pref-price-display" className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICE_DISPLAY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(`account.price.${opt.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {t(`account.price.${member.priceDisplay}Hint`)}
          </p>
        </FormField>
      </div>
    </SectionCard>
  );
}
