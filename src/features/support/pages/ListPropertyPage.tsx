import { useState, type FormEvent } from "react";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { LIST_PROPERTY_CONTENT } from "../constants/sitePages";

export function ListPropertyPage() {
  const { language, t } = useLanguage();
  const content = LIST_PROPERTY_CONTENT[language];
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8 sm:py-14">
        <header>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{content.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{content.intro}</p>
        </header>

        <ul className="mt-8 space-y-2">
          {content.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2 text-sm text-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {submitted ? (
            <SectionCard title={t("support.receivedReq")} description={t("support.touchSoon")}>
              <p className="text-sm text-muted-foreground">{t("support.thanksPartner")}</p>
            </SectionCard>
          ) : (
            <SectionCard
              title={t("support.partnerInquiry")}
              description={t("support.partnerInquiryHint")}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label={t("support.yourName")} htmlFor="lp-name" required>
                    <Input
                      id="lp-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("support.workEmail")} htmlFor="lp-email" required>
                    <Input
                      id="lp-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("support.propertyName")} htmlFor="lp-property" required>
                    <Input
                      id="lp-property"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                    />
                  </FormField>
                  <FormField label={t("support.city")} htmlFor="lp-city" required>
                    <Input
                      id="lp-city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </FormField>
                </div>
                <FormField label={t("support.message")} htmlFor="lp-message">
                  <Textarea
                    id="lp-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("support.listPh")}
                  />
                </FormField>
                <Button type="submit" className="rounded-xl">
                  {t("support.submitInquiry")}
                </Button>
              </form>
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
