import { cn } from "@/lib/utils";

interface FormMessageProps {
  error?: string | null;
  className?: string;
}

export function FormMessage({ error, className }: FormMessageProps) {
  if (!error) return null;
  return (
    <p className={cn("text-xs text-destructive", className)} role="alert">
      {error}
    </p>
  );
}
