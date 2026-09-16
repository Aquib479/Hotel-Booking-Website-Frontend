import { APP_LANGUAGES } from "@/lib/i18n/languages";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t("lang.aria")}
      className={cn(
        "inline-flex h-9 items-stretch overflow-hidden rounded-full border border-border bg-background",
        className,
      )}
    >
      {APP_LANGUAGES.map((option) => {
        const selected = language === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={selected}
            onClick={() => setLanguage(option.code)}
            className={cn(
              "px-2.5 text-xs font-semibold transition-colors sm:px-3",
              selected
                ? "bg-foreground text-background"
                : "text-foreground/80 hover:bg-muted hover:text-foreground",
            )}
          >
            <span className="sm:hidden">{option.short}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
