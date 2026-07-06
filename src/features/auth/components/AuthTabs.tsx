import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AUTH_FROM_BOOKING_PARAM } from "../constants";
import { useAuthRedirect } from "../hooks/useAuthRedirect";
import type { AuthTab } from "../types";

interface AuthTabsProps {
  active: AuthTab;
}

export function AuthTabs({ active }: AuthTabsProps) {
  const { buildAuthPath } = useAuthRedirect();
  const location = useLocation();
  const fromBooking = new URLSearchParams(location.search).get(AUTH_FROM_BOOKING_PARAM) === "1";

  const tabs: { id: AuthTab; label: string; path: string }[] = [
    { id: "login", label: "Log in", path: buildAuthPath("/login") },
    { id: "signup", label: "Sign up", path: buildAuthPath("/signup") },
  ];

  return (
    <div
      className={cn(
        "mb-6 flex rounded-xl border border-border bg-muted/40 p-1",
        fromBooking && active === "signup" && "opacity-90"
      )}
      role="tablist"
      aria-label="Authentication"
    >
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={tab.path}
          role="tab"
          aria-selected={active === tab.id}
          className={cn(
            "flex-1 rounded-lg py-2.5 text-center text-sm font-medium transition-colors",
            active === tab.id
              ? "bg-white text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
            fromBooking && tab.id === "login" && active === "signup" && "text-muted-foreground/70"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
