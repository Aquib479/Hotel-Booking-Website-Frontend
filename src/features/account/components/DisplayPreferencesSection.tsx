import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_OPTIONS, PRICE_DISPLAY_OPTIONS } from "../constants";
import type { LanguagePreference, MemberProfileDetails, PriceDisplayMode } from "../types";

interface DisplayPreferencesSectionProps {
  member: MemberProfileDetails;
  onChange: (patch: Partial<MemberProfileDetails>) => void;
}

export function DisplayPreferencesSection({ member, onChange }: DisplayPreferencesSectionProps) {
  return (
    <SectionCard
      title="Display preferences"
      description="Language and how prices appear while you browse"
    >
      <div className="space-y-4">
        <FormField label="Language" htmlFor="pref-language">
          <Select
            value={member.language}
            onValueChange={(v) => onChange({ language: v as LanguagePreference })}
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

        <FormField label="Price display" htmlFor="pref-price-display">
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
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {PRICE_DISPLAY_OPTIONS.find((o) => o.value === member.priceDisplay)?.hint}
          </p>
        </FormField>
      </div>
    </SectionCard>
  );
}
