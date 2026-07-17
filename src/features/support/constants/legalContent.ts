import { DIRECT_CANCEL_HOURS_BEFORE_SLOT } from "@/lib/booking/cancellation";
import type { LegalDocument } from "../types";
import { formatDirectCancellationBullets } from "../types";

const directBullets = formatDirectCancellationBullets();

export const TERMS_OF_SERVICE: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  lastUpdated: "2026-01-15",
  intro:
    "These Terms govern your use of RestHalf's website and booking services. By completing a booking you agree to these Terms and our Cancellation Policy.",
  sections: [
    {
      id: "acceptance",
      title: "Acceptance of terms",
      paragraphs: [
        "RestHalf provides a platform to search and book hotel rest slots and overnight stays. These Terms apply to all users, whether or not you create an account.",
        "If you book on behalf of someone else, you confirm you have authority to accept these Terms for them.",
      ],
    },
    {
      id: "services",
      title: "Our services",
      paragraphs: [
        "RestHalf offers RestHalf Exclusive (Direct) inventory confirmed by RestHalf and Partner (Wholesale) rates supplied by third parties. Product availability, pricing, and confirmation times vary by lane and property.",
      ],
      listItems: [
        "Direct bookings: sold and supported by RestHalf subject to these Terms.",
        "Partner bookings: subject to the supplier's terms in addition to these Terms where applicable.",
      ],
    },
    {
      id: "bookings",
      title: "Bookings and payment",
      paragraphs: [
        "A booking is confirmed only when you receive a confirmation reference and, where required, payment succeeds. Display currencies are indicative until checkout shows the charge currency and amount.",
        "You are responsible for accurate guest details, contact information, and compliance with hotel house rules.",
      ],
    },
    {
      id: "conduct",
      title: "Acceptable use",
      paragraphs: [
        "You may not misuse the platform, attempt unauthorized access, or make fraudulent bookings. We may suspend accounts or cancel bookings that violate these Terms or applicable law.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      paragraphs: [
        "RestHalf acts as an intermediary for Partner rates. To the extent permitted by law, RestHalf is not liable for acts or omissions of hotels or partner suppliers beyond our direct booking obligations.",
        "Nothing in these Terms limits rights that cannot be excluded under consumer protection law in your jurisdiction.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these Terms",
      paragraphs: [
        "We may update these Terms from time to time. The last-updated date at the top of this page indicates the current version. Material changes affecting existing bookings will be communicated where required.",
      ],
    },
    {
      id: "contact",
      title: "Contact",
      paragraphs: [
        "Questions about these Terms: support@resthalf.com or via our Contact page.",
      ],
    },
  ],
};

export const CANCELLATION_POLICY: LegalDocument = {
  slug: "cancellation-policy",
  title: "Cancellation Policy",
  lastUpdated: "2026-01-15",
  intro:
    "Cancellation and refund rules depend on whether you booked RestHalf Exclusive (Direct) or a Partner (Wholesale) rate. The summary shown at checkout and on your booking is drawn from this policy.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      paragraphs: [
        "Always check your booking confirmation for the policy that applied at the time of purchase. Partner bookings may include supplier-specific terms captured on your confirmation.",
      ],
    },
    {
      id: "direct-bookings",
      title: "RestHalf Exclusive (Direct) bookings",
      paragraphs: [
        `Direct rest and stay bookings follow RestHalf's cancellation windows. Free cancellation is available until ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} hours before your slot or check-in time (hotel local time).`,
      ],
      listItems: directBullets,
      subsections: [
        {
          id: "direct-refund-tiers",
          title: "Refund timing",
          paragraphs: [
            "Cancellations before the free cutoff receive a full refund of the amount paid for the booking.",
            `Cancellations within ${DIRECT_CANCEL_HOURS_BEFORE_SLOT} hours of slot start (or after check-in for stay bookings where applicable) forfeit the booking amount.`,
            "No-shows are treated as non-refundable.",
          ],
        },
        {
          id: "direct-processing",
          title: "How refunds are processed",
          paragraphs: [
            "Approved refunds are returned to your original payment method. Most refunds complete within 5–7 business days depending on your bank or wallet provider.",
            "Partial refunds, if any, will be explained on the cancellation preview before you confirm.",
          ],
        },
      ],
    },
    {
      id: "wholesale-bookings",
      title: "Partner (Wholesale) bookings",
      paragraphs: [
        "Partner bookings are fulfilled by third-party suppliers. RestHalf does not set partner cancellation terms — those terms are displayed when you select the rate and on your booking confirmation.",
        "RestHalf may assist with cancellation requests but cannot guarantee outcomes beyond the supplier's policy.",
      ],
      listItems: [
        "Cancellation windows and refund percentages are defined by the partner supplier.",
        "Supplier confirmation numbers may be required when contacting the hotel directly.",
        "Submit cancellation requests through My Bookings or RestHalf support if self-serve cancel is unavailable.",
        "Refund timelines follow the supplier and payment processor — often 5–14 business days.",
      ],
    },
    {
      id: "how-to-cancel",
      title: "How to cancel",
      paragraphs: [
        "Sign in, open My Bookings, select your booking, and follow the cancel flow when eligible. If cancel is unavailable, contact support with your booking reference.",
      ],
    },
    {
      id: "disputes",
      title: "Questions and disputes",
      paragraphs: [
        "For policy questions email support@resthalf.com with your booking reference. We will respond with the policy snapshot stored for your booking.",
      ],
    },
  ],
};

export const PRIVACY_POLICY: LegalDocument = {
  slug: "privacy",
  title: "Privacy Policy",
  lastUpdated: "2026-01-15",
  intro:
    "This Privacy Policy explains how RestHalf collects, uses, and protects personal data when you use our website and booking services.",
  sections: [
    {
      id: "data-we-collect",
      title: "Information we collect",
      paragraphs: [
        "We collect information you provide when searching, booking, creating an account, or contacting support.",
      ],
      listItems: [
        "Identity and contact: name, email, phone number (including WhatsApp).",
        "Booking details: hotels, dates, slots, guest counts, special requests.",
        "Payment metadata: method type and transaction references (we do not store full card numbers).",
        "Usage data: device, browser, and analytics to improve the product.",
      ],
    },
    {
      id: "how-we-use",
      title: "How we use your information",
      paragraphs: [
        "We use your data to process bookings, send confirmations and service messages (including WhatsApp), provide support, prevent fraud, and improve RestHalf.",
      ],
    },
    {
      id: "sharing",
      title: "Sharing with hotels and partners",
      paragraphs: [
        "We share necessary booking details with hotels and partner suppliers to fulfill your reservation. Partners process data under their own privacy policies when you complete a wholesale booking.",
      ],
    },
    {
      id: "whatsapp",
      title: "WhatsApp notifications",
      paragraphs: [
        "If you provide a mobile number, we may send booking confirmations and service updates via WhatsApp. You can manage marketing preferences in your account; transactional messages may still be sent for active bookings.",
      ],
    },
    {
      id: "retention",
      title: "Data retention",
      paragraphs: [
        "We retain booking and account records as needed for legal, tax, and support purposes, then delete or anonymize data when no longer required.",
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      paragraphs: [
        "Depending on your location you may have rights to access, correct, delete, or export your data. Contact privacy@resthalf.com or use account settings where available.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We use industry-standard measures to protect data in transit and at rest. No method of transmission over the internet is 100% secure.",
      ],
    },
    {
      id: "updates",
      title: "Policy updates",
      paragraphs: [
        "We may update this policy periodically. Continued use after changes constitutes acceptance of the updated policy where permitted by law.",
      ],
    },
  ],
};

export const LEGAL_DOCUMENTS = {
  terms: TERMS_OF_SERVICE,
  "cancellation-policy": CANCELLATION_POLICY,
  privacy: PRIVACY_POLICY,
} as const;

export const CONTACT_METHODS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Chat with us — fastest for booking questions on the go",
    href: "https://wa.me/6281234567890?text=Hi%20RestHalf%2C%20I%20need%20help%20with%20a%20booking",
    responseTime: "Usually replies within 1 hour",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    description: "support@resthalf.com",
    href: "mailto:support@resthalf.com?subject=RestHalf%20support%20request",
    responseTime: "Within 24 hours on business days",
  },
  {
    id: "phone",
    label: "Phone",
    description: "+62 812-3456-7890 (English & Bahasa)",
    href: "tel:+6281234567890",
    responseTime: "9:00–21:00 WIB",
  },
] as const;

export const CONTACT_SUBJECT_OPTIONS = [
  { value: "booking_issue" as const, label: "Booking issue" },
  { value: "refund_question" as const, label: "Refund question" },
  { value: "technical_issue" as const, label: "Technical issue" },
  { value: "other" as const, label: "Other" },
];
