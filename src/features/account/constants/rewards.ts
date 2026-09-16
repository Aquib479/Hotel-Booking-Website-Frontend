export const COINS_DEMO_BALANCE = 1250;
export const COINS_DEMO_PENDING = 200;

export const COINS_HISTORY = [
  {
    id: "1",
    label: "Booking reward · Rest slot Jakarta",
    amount: 150,
    date: "2026-07-28",
  },
  {
    id: "2",
    label: "Welcome bonus",
    amount: 500,
    date: "2026-06-12",
  },
  {
    id: "3",
    label: "Redeemed · checkout discount",
    amount: -300,
    date: "2026-07-02",
  },
] as const;

export const REDEEM_OPTIONS = [
  { id: "checkout-5", label: "₹5 / IDR 10k off next checkout", cost: 500 },
  { id: "checkout-10", label: "₹10 / IDR 25k off next checkout", cost: 1000 },
  { id: "priority", label: "Priority support on your next booking", cost: 750 },
] as const;

export const DEMO_USER_REVIEWS = [
  {
    id: "r1",
    hotelName: "Skyline Transit Hotel",
    city: "Jakarta",
    rating: 5,
    date: "2026-07-20",
    body: "Perfect rest slot between flights. Clean room and quick check-in.",
  },
  {
    id: "r2",
    hotelName: "Harbour View Suites",
    city: "Hyderabad",
    rating: 4,
    date: "2026-06-05",
    body: "Comfortable overnight stay. Would book again for early meetings.",
  },
] as const;
