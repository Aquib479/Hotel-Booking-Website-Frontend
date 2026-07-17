import { CONTACT_METHODS } from "../constants/legalContent";
import { ContactMethodCard } from "./ContactMethodCard";
import { ContactForm } from "./ContactForm";

export function ContactPageLayout() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Contact & support</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about a rest slot, refund, or partner booking? Reach us on WhatsApp for the
          fastest reply — or send a message below.
        </p>
      </header>

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
