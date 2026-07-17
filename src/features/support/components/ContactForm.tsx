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
import { CONTACT_SUBJECT_OPTIONS } from "../constants/legalContent";
import type { ContactFormValues, ContactSubjectCategory } from "../types";

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

    fetchBookings({ status: "upcoming", lane: "all", search: "", page: 1 })
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
        title="We've received your message"
        message={`Our team will reply to ${values.email} as soon as possible. For urgent booking issues, WhatsApp is usually fastest.`}
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
            Send another message
          </Button>
        }
      />
    );
  }

  return (
    <SectionCard title="Send us a message">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Name" htmlFor="contact-name" required>
            <Input
              id="contact-name"
              required
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Email" htmlFor="contact-email" required>
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
          <FormField label="Related booking" htmlFor="contact-booking" optional>
            <Select
              value={values.bookingId || "none"}
              onValueChange={(v) =>
                setValues((prev) => ({ ...prev, bookingId: v === "none" ? "" : v }))
              }
            >
              <SelectTrigger id="contact-booking" className="h-10 w-full">
                <SelectValue
                  placeholder={loadingBookings ? "Loading bookings…" : "Select a booking"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific booking</SelectItem>
                {bookings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.confirmationCode} — {b.hotelName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        <FormField label="Subject" htmlFor="contact-category" required>
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
              {CONTACT_SUBJECT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Message" htmlFor="contact-message" required>
          <Textarea
            id="contact-message"
            required
            rows={5}
            value={values.message}
            onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
            placeholder="Tell us how we can help…"
          />
        </FormField>

        <Button type="submit" variant="brand" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
      </form>
    </SectionCard>
  );
}
