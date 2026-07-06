import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { PHONE_COUNTRY_CODES, getDefaultPhoneCountryCode } from "@/lib/phone/constants";

export interface PhoneInputProps {
  countryCode: string;
  nationalNumber: string;
  onCountryCodeChange: (code: string) => void;
  onNationalNumberChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  touched?: boolean;
  showHelper?: boolean;
  className?: string;
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20";

export function PhoneInput({
  countryCode,
  nationalNumber,
  onCountryCodeChange,
  onNationalNumberChange,
  onBlur,
  error,
  touched,
  showHelper = true,
  className,
}: PhoneInputProps) {
  const { currency } = useCurrency();
  const defaultCode = getDefaultPhoneCountryCode(currency);
  const effectiveCode = countryCode || defaultCode;

  return (
    <div className={className}>
      <div className="flex gap-2">
        <select
          value={effectiveCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          onBlur={onBlur}
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
          value={nationalNumber}
          onChange={(e) => onNationalNumberChange(e.target.value.replace(/\D/g, ""))}
          onBlur={onBlur}
          className={cn(
            inputClass,
            "flex-1",
            touched && error && "border-red-400"
          )}
        />
      </div>
      {showHelper && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          We&apos;ll send booking updates to this number via WhatsApp
        </p>
      )}
      {touched && error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
