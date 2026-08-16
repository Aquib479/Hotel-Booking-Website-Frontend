import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { ACCOUNT_MENU_ITEMS } from "../constants/menu";
import type { AccountSection } from "../types";
import { ACCOUNT_SECTIONS } from "../constants";

interface AccountMenuNavProps {
  /** When on /account, highlight settings subsections */
  activeSection?: AccountSection;
  onSectionChange?: (section: AccountSection) => void;
  /** Compact popover layout */
  variant?: "sidebar" | "popover";
  onNavigate?: () => void;
}

export function AccountMenuNav({
  activeSection,
  onSectionChange,
  variant = "sidebar",
  onNavigate,
}: AccountMenuNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isAccountPage = location.pathname === "/account";
  const isPopover = variant === "popover";

  const handleSignOut = () => {
    logout();
    onNavigate?.();
    navigate("/");
  };

  return (
    <nav aria-label="Account menu">
      <ul className={cn("flex flex-col gap-0.5", isPopover && "gap-0")}>
        {ACCOUNT_MENU_ITEMS.map((item) => {
          if (item.action === "sign-out") {
            if (!isAuthenticated) return null;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0 opacity-70" aria-hidden />
                  {item.label}
                </button>
              </li>
            );
          }

          const href = item.href!;
          const pathOnly = href.split("?")[0];
          const isActive =
            pathOnly === "/account"
              ? isAccountPage && item.id === "account"
              : location.pathname === pathOnly || location.pathname.startsWith(`${pathOnly}/`);

          return (
            <li key={item.id}>
              <Link
                to={isAuthenticated || !item.authOnly ? href : `/login?returnTo=${encodeURIComponent(href)}`}
                onClick={onNavigate}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : item.tone === "danger"
                      ? "text-red-600/80 hover:bg-red-50 hover:text-red-700"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="size-4 shrink-0 opacity-70" aria-hidden />
                {item.label}
              </Link>

              {item.id === "account" && isAccountPage && onSectionChange && (
                <ul className="mt-0.5 mb-1 ml-6 space-y-0.5 border-l border-border pl-2">
                  {ACCOUNT_SECTIONS.map((section) => (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => {
                          onSectionChange(section.id);
                          onNavigate?.();
                        }}
                        className={cn(
                          "w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition-colors",
                          activeSection === section.id
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                        aria-current={activeSection === section.id ? "page" : undefined}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
