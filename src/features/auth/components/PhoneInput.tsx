import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { PHONE_COUNTRY_CODES, getDefaultPhoneCountryCode } from "@/lib/phone/constants";
import { FormMessage } from "@/components/common/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Select value={effectiveCode} onValueChange={onCountryCodeChange}>
          <SelectTrigger className="h-10 w-36 shrink-0" aria-label="Country code" onBlur={onBlur}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PHONE_COUNTRY_CODES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          autoComplete="tel-national"
          placeholder="8123456789"
          value={nationalNumber}
          onChange={(e) => onNationalNumberChange(e.target.value.replace(/\D/g, ""))}
          onBlur={onBlur}
          aria-invalid={!!(touched && error)}
          className={cn("flex-1", touched && error && "border-destructive")}
        />
      </div>
      {showHelper && (
        <p className="mt-1.5 text-xs text-muted-foreground">
          Used for WhatsApp booking confirmations
        </p>
      )}
      {touched && error && <FormMessage error={error} />}
    </div>
  );
}
