import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { ABOUT_CONTENT } from "../constants/sitePages";

export function AboutPage() {
  const { language, t } = useLanguage();
  const content = ABOUT_CONTENT[language];

  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <header>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{content.title}</h1>
          <div className="mt-4 space-y-4">
            {content.intro.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </header>

        <div className="mt-10 space-y-8">
          {content.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              {"subtitle" in section && section.subtitle ? (
                <p className="mt-2 text-base font-medium text-foreground">{section.subtitle}</p>
              ) : null}
              <div className="mt-2 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link to="/contact">{t("about.cta.contact")}</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/list-property">{t("about.cta.list")}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
