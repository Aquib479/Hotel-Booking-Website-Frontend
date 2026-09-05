import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import { useLanguage } from "@/context/LanguageContext";
import type { GuestDetailsValues } from "../types";

interface GuestDetailsFormProps {
  values: GuestDetailsValues;
  errors: Partial<Record<keyof GuestDetailsValues, string>>;
  touched: Partial<Record<keyof GuestDetailsValues, boolean>>;
  onChange: (field: keyof GuestDetailsValues, value: string) => void;
  onBlur: (field: keyof GuestDetailsValues) => void;
}

export function GuestDetailsForm({
  values,
  errors,
  touched,
  onChange,
  onBlur,
}: GuestDetailsFormProps) {
  const { t } = useLanguage();

  return (
    <SectionCard title={t("checkout.guest")} description={t("checkout.guestHint")}>
      <div className="space-y-4">
        <FormField
          label={t("auth.fullName")}
          htmlFor="guest-fullname"
          error={touched.fullName ? errors.fullName : undefined}
        >
          <Input
            id="guest-fullname"
            type="text"
            autoComplete="name"
            aria-invalid={!!(touched.fullName && errors.fullName)}
            value={values.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            onBlur={() => onBlur("fullName")}
          />
        </FormField>

        <FormField
          label={t("support.email")}
          htmlFor="guest-email"
          error={touched.email ? errors.email : undefined}
        >
          <Input
            id="guest-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!(touched.email && errors.email)}
            value={values.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
          />
        </FormField>

        <FormField label={t("auth.phone")} error={touched.phoneNumber ? errors.phoneNumber : undefined}>
          <PhoneInput
            countryCode={values.phoneCountryCode}
            nationalNumber={values.phoneNumber}
            onCountryCodeChange={(v) => onChange("phoneCountryCode", v)}
            onNationalNumberChange={(v) => onChange("phoneNumber", v)}
            onBlur={() => onBlur("phoneNumber")}
            error={errors.phoneNumber}
            touched={touched.phoneNumber}
          />
        </FormField>

        <FormField label={t("bookings.specialRequests")} optional htmlFor="guest-requests">
          <Textarea
            id="guest-requests"
            rows={3}
            value={values.specialRequests}
            onChange={(e) => onChange("specialRequests", e.target.value)}
            onBlur={() => onBlur("specialRequests")}
            placeholder={t("checkout.requestsPh")}
          />
        </FormField>
      </div>
    </SectionCard>
  );
}
