import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Coins,
  Heart,
  Info,
  LogOut,
  Mail,
  Star,
  ThumbsUp,
  Trash2,
  UserRound,
} from "lucide-react";

export interface AccountMenuItem {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  /** Destructive / secondary styling */
  tone?: "default" | "danger" | "muted";
  /** Requires auth; guests redirected via useRequireAuth on destination */
  authOnly?: boolean;
  action?: "sign-out";
}

/** Notebook account menu order (excluding settings subsections). */
export const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  { id: "contact", label: "Contact us", href: "/contact", icon: Mail },
  { id: "bookings", label: "My bookings", href: "/bookings", icon: BookOpen, authOnly: true },
  { id: "account", label: "My account", href: "/account", icon: UserRound, authOnly: true },
  { id: "list-property", label: "List your property", href: "/list-property", icon: Building2 },
  { id: "coins", label: "My coins", href: "/coins", icon: Coins, authOnly: true },
  { id: "saved", label: "Saved", href: "/favourites", icon: Heart },
  { id: "reviews", label: "Ratings & reviews", href: "/reviews", icon: Star, authOnly: true },
  { id: "about", label: "About RestHalf.com", href: "/about", icon: Info },
  { id: "rate-app", label: "Rate this app", href: "/rate-app", icon: ThumbsUp },
  { id: "sign-out", label: "Sign out", icon: LogOut, action: "sign-out", authOnly: true, tone: "muted" },
  {
    id: "delete",
    label: "Delete my account",
    href: "/account?section=danger",
    icon: Trash2,
    authOnly: true,
    tone: "danger",
  },
];
