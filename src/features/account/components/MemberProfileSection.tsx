import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { COUNTRY_OPTIONS, GENDER_OPTIONS } from "../constants";
import type { GenderOption, MemberProfileDetails, UserProfile } from "../types";

interface MemberProfileSectionProps {
  profile: UserProfile;
  onChange: (patch: Partial<MemberProfileDetails>) => void;
}

export function MemberProfileSection({ profile, onChange }: MemberProfileSectionProps) {
  const { t } = useLanguage();
  const { member } = profile;

  return (
    <SectionCard
      title={t("account.memberTitle")}
      description={t("account.memberHint")}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label={t("account.name")} htmlFor="member-name">
          <Input id="member-name" value={profile.fullName} disabled className="bg-muted/40" />
        </FormField>

        <FormField label={t("account.gender")} htmlFor="member-gender">
          <Select
            value={member.gender || undefined}
            onValueChange={(v) => onChange({ gender: v as GenderOption })}
          >
            <SelectTrigger id="member-gender">
              <SelectValue placeholder={t("account.selectGender")} />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(`account.gender.${opt.value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label={t("account.countryRegion")} htmlFor="member-country">
          <Select
            value={member.country || undefined}
            onValueChange={(v) => onChange({ country: v })}
          >
            <SelectTrigger id="member-country">
              <SelectValue placeholder={t("account.selectCountry")} />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((country) => (
                <SelectItem key={country} value={country}>
                  {t(`account.country.${country}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label={t("account.city")} htmlFor="member-city">
          <Input
            id="member-city"
            value={member.city}
            placeholder={t("account.cityPlaceholder")}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </FormField>

        <FormField label={t("account.phone")} htmlFor="member-phone">
          <Input
            id="member-phone"
            value={profile.phoneE164 || t("account.notSet")}
            disabled
            className="bg-muted/40"
          />
        </FormField>

        <FormField label={t("account.email")} htmlFor="member-email">
          <Input id="member-email" value={profile.email} disabled className="bg-muted/40" />
        </FormField>
      </div>
    </SectionCard>
  );
}
