import { MapPin } from "lucide-react";
import { CONTACT_METHODS, CONTACT_OFFICES } from "../constants/legalContent";
import { ContactMethodCard } from "./ContactMethodCard";
import { ContactForm } from "./ContactForm";

export function ContactPageLayout() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contact us</h1>
        <p className="mt-3 text-muted-foreground">
          Reach us by email, WhatsApp, or
          the form below — or visit one of our offices.
        </p>
      </header>

      <section className="mt-10" aria-labelledby="offices-heading">
        <h2 id="offices-heading" className="text-lg font-semibold text-foreground">
          Our offices
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {CONTACT_OFFICES.map((office) => (
            <div
              key={office.id}
              className="rounded-xl border border-border bg-card p-5 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{office.label}</p>
                  <p className="mt-0.5 text-sm text-foreground">{office.city}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {office.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {CONTACT_METHODS.map((method) => (
          <ContactMethodCard key={method.id} method={method} />
        ))}
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
