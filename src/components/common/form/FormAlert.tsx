import type { ReactNode } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface FormAlertProps {
  title?: string;
  message: string;
  variant?: "error" | "success";
  className?: string;
  action?: ReactNode;
}

export function FormAlert({
  title,
  message,
  variant = "error",
  className,
  action,
}: FormAlertProps) {
  const Icon = variant === "success" ? CheckCircle : AlertCircle;

  return (
    <Alert
      variant={variant === "error" ? "destructive" : "default"}
      className={cn(
        variant === "success" && "border-emerald-200 bg-emerald-50 text-emerald-900",
        className
      )}
    >
      <Icon className={variant === "success" ? "text-emerald-600" : undefined} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className={variant === "success" ? "text-emerald-800" : undefined}>
        {message}
        {action && <div className="mt-2">{action}</div>}
      </AlertDescription>
    </Alert>
  );
}
