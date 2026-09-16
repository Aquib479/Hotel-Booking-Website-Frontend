import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CONTACT_OFFICES,
  CONSUMER_COMPLAINT,
  getContactMethods,
} from "../constants/legalContent";
import { ContactMethodCard } from "./ContactMethodCard";
import { ContactForm } from "./ContactForm";

export function ContactPageLayout() {
  const { language, t } = useLanguage();
  const methods = getContactMethods(language);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{t("support.contact")}</h1>
        <p className="mt-3 text-muted-foreground">{t("support.contactHint")}</p>
      </header>

      <section className="mt-10" aria-labelledby="offices-heading">
        <h2 id="offices-heading" className="text-lg font-semibold text-foreground">
          {t("support.offices")}
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
        {methods.map((method) => (
          <ContactMethodCard key={method.id} method={method} />
        ))}
      </div>

      <section
        className="mt-10 rounded-xl border border-border bg-card p-5 shadow-xs sm:p-6"
        aria-labelledby="consumer-complaint-heading"
      >
        <h2 id="consumer-complaint-heading" className="sr-only">
          {CONSUMER_COMPLAINT.en.heading} / {CONSUMER_COMPLAINT.id.heading}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-1 text-sm leading-relaxed text-foreground">
            <p className="font-semibold">{CONSUMER_COMPLAINT.en.heading}</p>
            <p>{CONSUMER_COMPLAINT.en.agency}</p>
            <p>{CONSUMER_COMPLAINT.en.ministry}</p>
            <p>
              <a
                href={CONSUMER_COMPLAINT.agencyWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                {CONSUMER_COMPLAINT.whatsappLine}
              </a>
            </p>
          </div>
          <div className="space-y-1 text-sm leading-relaxed text-foreground">
            <p className="font-semibold">{CONSUMER_COMPLAINT.id.heading}</p>
            <p>{CONSUMER_COMPLAINT.id.agency}</p>
            <p>{CONSUMER_COMPLAINT.id.ministry}</p>
            <p>
              <a
                href={CONSUMER_COMPLAINT.agencyWhatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-brand hover:underline"
              >
                {CONSUMER_COMPLAINT.whatsappLine}
              </a>
            </p>
          </div>
        </div>
      </section>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
