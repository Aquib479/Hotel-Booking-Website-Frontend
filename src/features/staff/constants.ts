export const STAFF_AUTH_STORAGE_KEY = "resthalf-staff-session";
export const STAFF_WALKINS_STORAGE_KEY = "resthalf-staff-walk-ins";
export const STAFF_ROOM_LOCKS_KEY = "resthalf-staff-room-locks";

/** Poll availability during active front-desk sessions */
export const ROOM_REFRESH_INTERVAL_MS = 30_000;

export const STAFF_LOGIN_PATH = "/staff/login";
export const STAFF_WALK_IN_PATH = "/staff/walk-in";
export const STAFF_DASHBOARD_PATH = "/staff/dashboard";

export const WALK_IN_PAYMENT_METHODS = [
  {
    id: "cash" as const,
    label: "Cash",
    description: "Guest pays at the desk — mark as paid after collection",
  },
  {
    id: "card" as const,
    label: "Card (terminal)",
    description: "Property card terminal — record payment here for reconciliation",
  },
  {
    id: "online" as const,
    label: "Online link",
    description: "Send Midtrans / Xendit payment link to guest phone",
  },
];

/** Mock commission rate — real value always from backend */
export const MOCK_COMMISSION_RATE = 0.08;

export const MOCK_STAFF_CREDENTIALS = {
  email: "desk@resthalf-airport.com",
  password: "desk2026",
} as const;
