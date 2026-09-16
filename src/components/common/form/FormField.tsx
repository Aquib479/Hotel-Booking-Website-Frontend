import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FormMessage } from "./FormMessage";
import { useLanguage } from "@/context/LanguageContext";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string | null;
  showError?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required,
  optional,
  hint,
  error,
  showError = true,
  children,
  className,
}: FormFieldProps) {
  const { t } = useLanguage();
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
        {optional && (
          <span className="font-normal text-muted-foreground"> {t("common.optional")}</span>
        )}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {showError && <FormMessage error={error} />}
    </div>
  );
}
