import { cn } from "@/lib/utils";
import { PhoneInput } from "@/features/auth/components/PhoneInput";
import type { GuestDetailsValues } from "../types";

interface GuestDetailsFormProps {
  values: GuestDetailsValues;
  errors: Partial<Record<keyof GuestDetailsValues, string>>;
  touched: Partial<Record<keyof GuestDetailsValues, boolean>>;
  onChange: (field: keyof GuestDetailsValues, value: string) => void;
  onBlur: (field: keyof GuestDetailsValues) => void;
}

function Field({
  label,
  error,
  touched,
  children,
}: {
  label: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
      {touched && error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

export function GuestDetailsForm({
  values,
  errors,
  touched,
  onChange,
  onBlur,
}: GuestDetailsFormProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Guest details</h2>
        <p className="text-sm text-muted-foreground">
          Used for your confirmation and WhatsApp updates
        </p>
      </div>

      <Field label="Full name" error={errors.fullName} touched={touched.fullName}>
        <input
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          onBlur={() => onBlur("fullName")}
          className={cn(inputClass, touched.fullName && errors.fullName && "border-red-400")}
        />
      </Field>

      <Field label="Email" error={errors.email} touched={touched.email}>
        <input
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          onBlur={() => onBlur("email")}
          className={cn(inputClass, touched.email && errors.email && "border-red-400")}
        />
      </Field>

      <Field label="Phone number" error={errors.phoneNumber} touched={touched.phoneNumber}>
        <PhoneInput
          countryCode={values.phoneCountryCode}
          nationalNumber={values.phoneNumber}
          onCountryCodeChange={(v) => onChange("phoneCountryCode", v)}
          onNationalNumberChange={(v) => onChange("phoneNumber", v)}
          onBlur={() => onBlur("phoneNumber")}
          error={errors.phoneNumber}
          touched={touched.phoneNumber}
        />
      </Field>

      <Field label="Special requests (optional)" error={errors.specialRequests} touched={touched.specialRequests}>
        <textarea
          rows={3}
          value={values.specialRequests}
          onChange={(e) => onChange("specialRequests", e.target.value)}
          onBlur={() => onBlur("specialRequests")}
          placeholder="Late check-in, accessibility needs, etc."
          className={cn(inputClass, "resize-none")}
        />
      </Field>
    </section>
  );
}
