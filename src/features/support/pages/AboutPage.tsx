import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ABOUT_CONTENT } from "../constants/sitePages";

export function AboutPage() {
  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <header>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{ABOUT_CONTENT.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{ABOUT_CONTENT.intro}</p>
        </header>

        <div className="mt-10 space-y-8">
          {ABOUT_CONTENT.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link to="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/list-property">List your property</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
