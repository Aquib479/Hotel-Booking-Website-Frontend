import { useLanguage } from "@/context/LanguageContext";

export function AuthDivider({ label }: { label?: string }) {
  const { t } = useLanguage();
  const text = label ?? t("auth.orEmail");

  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-white px-3 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
}
