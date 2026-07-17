import type { FaqCategory, FaqItem } from "../types";

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "half-day-booking",
    label: "How half-day booking works",
    description: "Rest slots, stay mode, and what makes RestHalf different",
  },
  {
    id: "booking-payment",
    label: "Booking & payment",
    description: "Direct vs Partner rates, currencies, and payment methods",
  },
  {
    id: "cancellations-refunds",
    label: "Cancellations & refunds",
    description: "Cutoffs, refund timing, and lane differences",
  },
  {
    id: "check-in",
    label: "Check-in & at the hotel",
    description: "What to bring, where to go, and slot windows",
  },
  {
    id: "account-notifications",
    label: "Account & WhatsApp",
    description: "Sign-in, notifications, and managing bookings",
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-half-day",
    category: "half-day-booking",
    question: "What is a half-day or rest slot booking?",
    answer:
      "RestHalf lets you book hotel time in fixed windows — typically 12 hours — instead of only full overnight stays. Rest mode is built for layovers, early arrivals, and anyone who needs a shower and sleep without paying for a full night. Stay mode works like a normal hotel booking with check-in and check-out dates.",
  },
  {
    id: "rest-vs-stay",
    category: "half-day-booking",
    question: "What's the difference between Rest and Stay?",
    answer:
      "Rest is time-boxed: you pick a date and a slot window (for example 12:00–24:00). Stay is date-range based: check-in and check-out across one or more nights. Both are available on RestHalf Exclusive (Direct) and Partner (Wholesale) properties where offered.",
  },
  {
    id: "slot-windows",
    category: "half-day-booking",
    question: "How do slot windows work?",
    answer:
      "Each rest booking covers a defined window on a single calendar day — such as midnight–noon, noon–midnight, or a full 24-hour block. Your confirmation shows the exact window in the hotel's local time. Arrive within that window; late arrival may shorten usable time.",
  },
  {
    id: "direct-vs-wholesale",
    category: "booking-payment",
    question: "What is RestHalf Exclusive vs Partner rate?",
    answer:
      "RestHalf Exclusive (Direct) bookings are sold and confirmed by RestHalf — instant confirmation and RestHalf cancellation rules apply. Partner (Wholesale) rates come from third-party suppliers; RestHalf hands you off to complete payment and the supplier's terms apply.",
    laneAnswers: {
      direct:
        "Booked on RestHalf with instant confirmation. Payment and support are handled through RestHalf. Cancellation follows RestHalf Exclusive policy.",
      wholesale:
        "Sourced from a partner supplier. You may complete payment on a partner flow. The supplier's cancellation and refund rules apply — shown at booking and on your confirmation.",
    },
  },
  {
    id: "payment-methods",
    category: "booking-payment",
    question: "Which payment methods are accepted?",
    answer:
      "For Direct bookings we support cards, e-wallets (GoPay, OVO, DANA), and virtual accounts depending on your market. Partner bookings may offer different methods on the supplier checkout. All amounts are shown in the currency charged at checkout.",
  },
  {
    id: "currency-display",
    category: "booking-payment",
    question: "Can I browse in a different currency than I pay?",
    answer:
      "Yes. RestHalf lets you switch display currency while browsing. The amount charged at checkout is always shown clearly before you pay — that is the currency your card or wallet will be debited in.",
  },
  {
    id: "how-to-cancel",
    category: "cancellations-refunds",
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, select the booking, and use Cancel booking if eligible. Policies differ by lane.",
    laneAnswers: {
      direct:
        "Cancel from My Bookings up to 2 hours before your slot starts for a full refund. Inside 2 hours, the slot rate is non-refundable.",
      wholesale:
        "Submit a cancellation request through RestHalf support. Refunds follow the partner supplier's policy shown at booking — RestHalf cannot override partner terms after handoff.",
    },
  },
  {
    id: "refund-timing",
    category: "cancellations-refunds",
    question: "How long do refunds take?",
    answer:
      "Approved refunds typically appear on your original payment method within 5–7 business days. Partner bookings may follow the supplier's timeline. Track refund status on your booking detail page when applicable.",
  },
  {
    id: "no-show",
    category: "cancellations-refunds",
    question: "What happens if I don't show up?",
    answer:
      "No-shows on RestHalf Exclusive rest slots are non-refundable. For Partner stays, the supplier's no-show policy applies. Contact support as soon as possible if your plans change.",
  },
  {
    id: "check-in-what-to-bring",
    category: "check-in",
    question: "What do I need at check-in?",
    answer:
      "Bring a valid photo ID and your booking reference (also sent via WhatsApp). For rest slots, arrive within your confirmed window and go to the front desk unless your confirmation specifies otherwise.",
  },
  {
    id: "airport-hotels",
    category: "check-in",
    question: "Are rest slots only at airport hotels?",
    answer:
      "Many rest slots are at properties near major airports, but RestHalf also lists city hotels. Use location search and filters to find properties that fit your trip.",
  },
  {
    id: "whatsapp-confirmation",
    category: "account-notifications",
    question: "Will I get a WhatsApp confirmation?",
    answer:
      "Yes — for Direct bookings we send confirmation details to the WhatsApp number you provide at checkout. This message mirrors your web confirmation: reference, hotel, slot or dates, and check-in guidance.",
  },
  {
    id: "guest-checkout",
    category: "account-notifications",
    question: "Do I need an account to book?",
    answer:
      "No. You can complete guest checkout. Creating an account lets you manage bookings, save details, and update notification preferences in one place.",
  },
  {
    id: "manage-bookings",
    category: "account-notifications",
    question: "Where do I view my bookings?",
    answer:
      "Sign in and open My Bookings from the navigation menu or your account page. You'll see upcoming, past, and cancelled bookings with filters by lane.",
  },
];

export function getFaqItemsByCategory(categoryId: FaqCategory["id"]): FaqItem[] {
  return FAQ_ITEMS.filter((item) => item.category === categoryId);
}
