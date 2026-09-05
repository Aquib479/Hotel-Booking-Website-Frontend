import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { HOW_IT_WORKS_CONTENT } from "../constants/sitePages";

export function HowItWorksPage() {
  const { language, t } = useLanguage();
  const content = HOW_IT_WORKS_CONTENT[language];

  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <header>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{content.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{content.intro}</p>
        </header>

        <ol className="mt-10 space-y-8">
          {content.steps.map((step) => (
            <li key={step.number}>
              <h2 className="text-xl font-semibold text-foreground">
                {step.number}. {step.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-10 text-base font-medium text-foreground">{content.tagline}</p>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link to="/">{t("how.cta.search")}</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/about">{t("how.cta.about")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
