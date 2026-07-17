import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    <Tabs
      value={active}
      className={cn("mb-6", fromBooking && active === "signup" && "opacity-90")}
    >
      <TabsList className="grid h-auto w-full grid-cols-2" aria-label="Authentication">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id} asChild>
            <Link
              to={tab.path}
              className={cn(
                "w-full py-2.5",
                fromBooking && tab.id === "login" && active === "signup" && "text-muted-foreground/70"
              )}
            >
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
