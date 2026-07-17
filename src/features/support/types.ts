import type { BookingLane } from "@/lib/booking/types";
import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";

export type FaqCategoryId =
  | "half-day-booking"
  | "booking-payment"
  | "cancellations-refunds"
  | "check-in"
  | "account-notifications";

export interface FaqCategory {
  id: FaqCategoryId;
  label: string;
  description?: string;
}

export interface FaqLaneAnswers {
  direct?: string;
  wholesale?: string;
}

export interface FaqItem {
  id: string;
  category: FaqCategoryId;
  question: string;
  /** Plain answer, or use laneAnswers when Direct vs Wholesale differs */
  answer: string;
  laneAnswers?: FaqLaneAnswers;
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  listItems?: string[];
  subsections?: LegalSection[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
}

export interface ContactMethod {
  id: string;
  label: string;
  description: string;
  href: string;
  responseTime?: string;
  external?: boolean;
}

export type ContactSubjectCategory =
  | "booking_issue"
  | "refund_question"
  | "technical_issue"
  | "other";

export interface ContactFormValues {
  name: string;
  email: string;
  bookingId: string;
  category: ContactSubjectCategory;
  message: string;
}

export interface CancellationPolicySummary {
  headline: string;
  bullets: string[];
}

/** Shared cancellation copy — single source for checkout summary, booking detail, and legal page */
export function getCancellationPolicySummary(
  lane: BookingLane,
  supplierName?: string
): CancellationPolicySummary {
  const hours = DIRECT_CANCEL_HOURS_BEFORE_SLOT;
  const supplier = supplierName ?? "our partner supplier";

  if (lane === "direct") {
    return {
      headline: `Free cancellation up to ${hours} hours before slot start`,
      bullets: [
        `Cancel free of charge up to ${hours} hours before your slot begins.`,
        `Cancellations within ${hours} hours are charged the full slot rate.`,
        "No-shows are non-refundable.",
        "Refunds are processed within 5–7 business days to your original payment method.",
      ],
    };
  }

  return {
    headline: "Subject to partner cancellation policy",
    bullets: [
      `This rate is provided by ${supplier}.`,
      "Cancellation and refund rules follow the supplier's policy at time of booking.",
      "RestHalf cannot override partner policies once the handoff is complete.",
      "Contact RestHalf support if you need help before completing payment with the partner.",
    ],
  };
}

export function formatSupplierCancellationBullets(supplierName?: string): string[] {
  return getCancellationPolicySummary("wholesale", supplierName).bullets;
}

export function formatDirectCancellationBullets(): string[] {
  return getCancellationPolicySummary("direct").bullets;
}
