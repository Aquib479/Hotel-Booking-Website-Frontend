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
import { COUNTRY_OPTIONS, GENDER_OPTIONS } from "../constants";
import type { GenderOption, MemberProfileDetails, UserProfile } from "../types";

interface MemberProfileSectionProps {
  profile: UserProfile;
  onChange: (patch: Partial<MemberProfileDetails>) => void;
}

export function MemberProfileSection({ profile, onChange }: MemberProfileSectionProps) {
  const { member } = profile;

  return (
    <SectionCard
      title="Member profile"
      description="Optional details that help personalize your RestHalf experience"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="member-name">
          <Input id="member-name" value={profile.fullName} disabled className="bg-muted/40" />
        </FormField>

        <FormField label="Gender" htmlFor="member-gender">
          <Select
            value={member.gender || undefined}
            onValueChange={(v) => onChange({ gender: v as GenderOption })}
          >
            <SelectTrigger id="member-gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Country or region" htmlFor="member-country">
          <Select
            value={member.country || undefined}
            onValueChange={(v) => onChange({ country: v })}
          >
            <SelectTrigger id="member-country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="City of residence" htmlFor="member-city">
          <Input
            id="member-city"
            value={member.city}
            placeholder="e.g. Jakarta"
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </FormField>

        <FormField label="Phone number" htmlFor="member-phone">
          <Input
            id="member-phone"
            value={profile.phoneE164 || "Not set"}
            disabled
            className="bg-muted/40"
          />
        </FormField>

        <FormField label="Email" htmlFor="member-email">
          <Input id="member-email" value={profile.email} disabled className="bg-muted/40" />
        </FormField>
      </div>
    </SectionCard>
  );
}
