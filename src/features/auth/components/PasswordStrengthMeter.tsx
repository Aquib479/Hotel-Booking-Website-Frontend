import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

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

const STRENGTH_KEYS = [
  "auth.weak",
  "auth.strength.weak",
  "auth.fair",
  "auth.good",
  "auth.strong",
] as const;
const COLORS = ["bg-red-400", "bg-orange-400", "bg-amber-400", "bg-lime-500", "bg-emerald-500"];

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const { t } = useLanguage();
  if (!password) return null;

  const score = scorePassword(password);
  const label = t(STRENGTH_KEYS[score]);

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
      <p className="mt-1 text-xs text-muted-foreground">{t("auth.passwordStrength", { label })}</p>
    </div>
  );
}
