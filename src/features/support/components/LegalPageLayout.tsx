import type { LegalDocument, LegalSection } from "../types";
import { LegalTableOfContents } from "./LegalTableOfContents";

function LegalSectionBlock({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
        {section.paragraphs.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        {section.listItems && (
          <ul className="list-disc space-y-2 pl-5">
            {section.listItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      {section.subsections?.map((sub) => (
        <div key={sub.id} id={sub.id} className="mt-6 scroll-mt-24">
          <h3 className="text-base font-semibold text-foreground">{sub.title}</h3>
          <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {sub.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
            {sub.listItems && (
              <ul className="list-disc space-y-2 pl-5">
                {sub.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

interface LegalPageLayoutProps {
  document: LegalDocument;
}

export function LegalPageLayout({ document }: LegalPageLayoutProps) {
  const formattedDate = new Date(document.lastUpdated).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="max-w-3xl border-b border-border pb-8">
        <p className="text-sm text-muted-foreground">Last updated {formattedDate}</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">{document.title}</h1>
        {document.intro && <p className="mt-4 text-muted-foreground">{document.intro}</p>}
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        <LegalTableOfContents sections={document.sections} />

        <article className="min-w-0 space-y-10">
          {document.sections.map((section) => (
            <LegalSectionBlock key={section.id} section={section} />
          ))}
        </article>
      </div>
    </div>
  );
}
