import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import type { NoDraftReason } from "../types";

interface NoActiveDraftStateProps {
  reason?: NoDraftReason;
  title?: string;
  body?: string;
  cta?: string;
  searchHref?: string;
}

export function NoActiveDraftState({
  reason = "missing",
  title,
  body,
  cta,
  searchHref = "/search",
}: NoActiveDraftStateProps) {
  const { t } = useLanguage();
  const defaults =
    reason === "expired"
      ? {
          title: t("checkout.holdExpiredTitle"),
          body: t("checkout.holdExpiredBody"),
          cta: t("checkout.searchAgain"),
        }
      : {
          title: t("checkout.noDraftTitle"),
          body: t("checkout.noDraftBody"),
          cta: t("checkout.backSearch"),
        };

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">{title ?? defaults.title}</h1>
      <p className="mt-3 text-muted-foreground">{body ?? defaults.body}</p>
      <Button asChild className="mt-8 rounded-xl px-8">
        <Link to={searchHref}>{cta ?? defaults.cta}</Link>
      </Button>
    </main>
  );
}
