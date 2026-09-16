import { useState } from "react";
import { Star } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RATE_APP_CONTENT } from "../constants/sitePages";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function RateAppPage() {
  const { language, t } = useLanguage();
  const content = RATE_APP_CONTENT[language];
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8 sm:py-14">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{content.title}</h1>
          <p className="mt-3 text-muted-foreground">{content.intro}</p>
        </header>

        <div className="mt-10">
          {submitted ? (
            <SectionCard title={t("support.thankYou")} description={t("support.appreciate")}>
              <p className="text-sm text-muted-foreground">{t("support.ratingHelps")}</p>
            </SectionCard>
          ) : (
            <SectionCard title={t("support.howDoing")} description={t("support.tapStar")}>
              <div
                className="flex justify-center gap-1"
                role="radiogroup"
                aria-label={t("support.appRating")}
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= (hover || rating);
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={value === 1 ? t("support.starOne") : t("support.starsN", { n: value })}
                      className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={cn(
                          "size-8",
                          active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <Textarea
                className="mt-4"
                rows={4}
                placeholder={t("support.improvePh")}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <Button
                className="mt-4 w-full rounded-xl"
                disabled={rating === 0}
                onClick={() => setSubmitted(true)}
              >
                {t("support.submitRating")}
              </Button>

              <div className="mt-6 space-y-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">{t("support.orStores")}</p>
                {content.storeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="block text-sm font-medium text-brand hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
