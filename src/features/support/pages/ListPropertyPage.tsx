import { useState, type FormEvent } from "react";
import { FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LIST_PROPERTY_CONTENT } from "../constants/sitePages";

export function ListPropertyPage() {
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
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {LIST_PROPERTY_CONTENT.title}
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {LIST_PROPERTY_CONTENT.intro}
          </p>
        </header>

        <ul className="mt-8 space-y-2">
          {LIST_PROPERTY_CONTENT.benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2 text-sm text-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {submitted ? (
            <SectionCard title="Request received" description="We'll be in touch soon.">
              <p className="text-sm text-muted-foreground">
                Thanks for your interest. Our partnerships team typically replies within 2 business
                days at contactus@RestHalf.com.
              </p>
            </SectionCard>
          ) : (
            <SectionCard
              title="Partner inquiry"
              description="Tell us about your property — we'll follow up with next steps."
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Your name" htmlFor="lp-name" required>
                    <Input
                      id="lp-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Work email" htmlFor="lp-email" required>
                    <Input
                      id="lp-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormField>
                  <FormField label="Property name" htmlFor="lp-property" required>
                    <Input
                      id="lp-property"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                    />
                  </FormField>
                  <FormField label="City" htmlFor="lp-city" required>
                    <Input
                      id="lp-city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </FormField>
                </div>
                <FormField label="Message" htmlFor="lp-message">
                  <Textarea
                    id="lp-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inventory type, number of rooms, rest-slot interest…"
                  />
                </FormField>
                <Button type="submit" className="rounded-xl">
                  Submit inquiry
                </Button>
              </form>
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
