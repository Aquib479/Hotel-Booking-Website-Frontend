import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps {
  password: string;
}

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  return Math.min(score, 4);
}

const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
const COLORS = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  if (!password) return null;

  const score = scorePassword(password);
  const label = LABELS[score];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full bg-muted",
              i < score && COLORS[score]
            )}
          />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Password strength: {label}</p>
    </div>
  );
}
