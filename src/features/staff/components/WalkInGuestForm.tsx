import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Input } from "@/components/ui/input";
import type { WalkInGuestDetails } from "../types";

interface WalkInGuestFormProps {
  guest: WalkInGuestDetails;
  onChange: (patch: Partial<WalkInGuestDetails>) => void;
}

export function WalkInGuestForm({ guest, onChange }: WalkInGuestFormProps) {
  return (
    <SectionCard title="Guest details" description="Walk-in — keep it quick">
      <div className="space-y-4">
        <FormField label="Full name" htmlFor="walkin-name" required>
          <Input
            id="walkin-name"
            required
            value={guest.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="Guest name"
          />
        </FormField>

        <FormField label="Phone (WhatsApp)" required>
          <PhoneInput
            countryCode={guest.phoneCountryCode}
            nationalNumber={guest.phoneNational}
            onCountryCodeChange={(code) => onChange({ phoneCountryCode: code })}
            onNationalNumberChange={(n) => onChange({ phoneNational: n })}
            showHelper={false}
          />
        </FormField>

        <FormField label="Email" htmlFor="walkin-email" optional>
          <Input
            id="walkin-email"
            type="email"
            value={guest.email ?? ""}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="guest@email.com"
          />
        </FormField>

        <FormField label="ID / passport" htmlFor="walkin-id" optional hint="If required for hotel check-in records">
          <Input
            id="walkin-id"
            value={guest.idDocument ?? ""}
            onChange={(e) => onChange({ idDocument: e.target.value })}
            placeholder="Optional"
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
