import { cn } from "@/lib/utils";
import { PHONE_COUNTRY_CODES } from "../constants";
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
        <div className="flex gap-2">
          <select
            value={values.phoneCountryCode}
            onChange={(e) => onChange("phoneCountryCode", e.target.value)}
            onBlur={() => onBlur("phoneCountryCode")}
            className={cn(inputClass, "w-36 shrink-0")}
            aria-label="Country code"
          >
            {PHONE_COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="tel"
            autoComplete="tel-national"
            placeholder="8123456789"
            value={values.phoneNumber}
            onChange={(e) => onChange("phoneNumber", e.target.value.replace(/\D/g, ""))}
            onBlur={() => onBlur("phoneNumber")}
            className={cn(
              inputClass,
              "flex-1",
              touched.phoneNumber && errors.phoneNumber && "border-red-400"
            )}
          />
        </div>
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
