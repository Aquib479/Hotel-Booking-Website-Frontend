import type { BookingLane } from "@/lib/booking/types";
import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";
import type { AppLanguage } from "@/lib/i18n/languages";
import { translate } from "@/lib/i18n/messages";

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
  supplierName?: string,
  language: AppLanguage = "en",
): CancellationPolicySummary {
  const hours = DIRECT_CANCEL_HOURS_BEFORE_SLOT;
  const supplier = supplierName ?? translate(language, "policy.partnerSupplier");

  if (lane === "direct") {
    return {
      headline: translate(language, "policy.directHeadline", { hours }),
      bullets: [
        translate(language, "policy.directB1", { hours }),
        translate(language, "policy.directB2", { hours }),
        translate(language, "policy.directB3"),
        translate(language, "policy.directB4"),
      ],
    };
  }

  return {
    headline: translate(language, "policy.wholesaleHeadline"),
    bullets: [
      translate(language, "policy.wholesaleB1", { supplier }),
      translate(language, "policy.wholesaleB2"),
      translate(language, "policy.wholesaleB3"),
      translate(language, "policy.wholesaleB4"),
    ],
  };
}

export function formatSupplierCancellationBullets(
  supplierName?: string,
  language: AppLanguage = "en",
): string[] {
  return getCancellationPolicySummary("wholesale", supplierName, language).bullets;
}

export function formatDirectCancellationBullets(language: AppLanguage = "en"): string[] {
  return getCancellationPolicySummary("direct", undefined, language).bullets;
}
