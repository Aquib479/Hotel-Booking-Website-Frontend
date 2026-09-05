import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { fetchBookings } from "@/features/bookings/api";
import type { BookingRecord } from "@/features/bookings/types";
import { FormAlert, FormField } from "@/components/common/form";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getContactSubjectOptions } from "../constants/legalContent";
import type { ContactFormValues, ContactSubjectCategory } from "../types";
import { useLanguage } from "@/context/LanguageContext";

const INITIAL: ContactFormValues = {
  name: "",
  email: "",
  bookingId: "",
  category: "booking_issue",
  message: "",
};

interface ContactFormProps {
  onSubmitted?: () => void;
}

export function ContactForm({ onSubmitted }: ContactFormProps) {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [values, setValues] = useState<ContactFormValues>(INITIAL);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setValues((v) => ({
        ...v,
        name: user.fullName,
        email: user.email,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;
    setLoadingBookings(true);

    fetchBookings({ status: "upcoming", search: "", page: 1 })
      .then((result) => {
        if (!cancelled) setBookings(result.bookings);
      })
      .finally(() => {
        if (!cancelled) setLoadingBookings(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    setSubmitted(true);
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <FormAlert
        variant="success"
        title={t("support.received")}
        message={t("support.receivedBody", { email: values.email })}
        action={
          <Button
            type="button"
            variant="link"
            className="mt-2 h-auto p-0 text-brand"
            onClick={() => {
              setSubmitted(false);
              setValues((v) => ({ ...INITIAL, name: v.name, email: v.email }));
            }}
          >
            {t("support.sendAnother")}
          </Button>
        }
      />
    );
  }

  return (
    <SectionCard title={t("support.sendMessage")}>
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("support.name")} htmlFor="contact-name" required>
            <Input
              id="contact-name"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </FormField>
          <FormField label={t("support.email")} htmlFor="contact-email" required>
            <Input
              id="contact-email"
              type="email"
              required
              value={values.email}
              onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            />
          </FormField>
        </div>

        {isAuthenticated && (
          <FormField label={t("support.relatedBooking")} htmlFor="contact-booking" optional>
            <Select
              value={values.bookingId || "none"}
              onValueChange={(v) =>
                setValues((prev) => ({ ...prev, bookingId: v === "none" ? "" : v }))
              }
            >
              <SelectTrigger id="contact-booking" className="h-10 w-full">
                <SelectValue
                  placeholder={loadingBookings ? t("support.loadingBookings") : t("support.selectBooking")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("support.noBooking")}</SelectItem>
                {bookings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.confirmationCode} — {b.hotelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        <FormField label={t("support.subject")} htmlFor="contact-category" required>
          <Select
            value={values.category}
            onValueChange={(v) =>
              setValues((prev) => ({ ...prev, category: v as ContactSubjectCategory }))
            }
          >
            <SelectTrigger id="contact-category" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getContactSubjectOptions(t).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label={t("support.message")} htmlFor="contact-message" required>
          <Textarea
            id="contact-message"
            required
            rows={5}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            placeholder={t("support.messagePh")}
          />
        </FormField>

        <Button type="submit" variant="brand" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              {t("support.sending")}
            </>
          ) : (
            t("support.send")
          )}
        </Button>
      </form>
    </SectionCard>
  );
}
