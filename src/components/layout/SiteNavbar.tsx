import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { CurrencySwitcher } from "@/components/common/CurrencySwitcher";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { cn } from "@/lib/utils";
import { SITE_NAV_LINKS } from "./site-nav";

type SiteNavbarVariant = "default" | "inline";

interface SiteNavbarProps {
  /** Renders without sticky/fixed positioning (used inside search sticky chrome). */
  variant?: SiteNavbarVariant;
  className?: string;
}

export function SiteNavbar({
  variant = "default",
  className,
}: SiteNavbarProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isInline = variant === "inline";
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isHome || isInline) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, isInline]);

  const isOverlay = !isInline && isHome && !scrolled;

  return (
    <header
      className={cn(
        "z-50 w-full transition-[background-color,border-color,box-shadow,backdrop-filter,transform] duration-300",
        !isInline && (isHome ? "fixed top-0" : "sticky top-0"),
        isOverlay
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link
          to="/"
          aria-label="RestHalf home"
          className="inline-flex shrink-0 items-center"
        >
          <img
            src="/resthalf-logo.png"
            alt="RestHalf.com"
            className={cn("h-10 w-auto rounded-md object-contain sm:h-11")}
          />
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {SITE_NAV_LINKS.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors",
                    isOverlay
                      ? isActive
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                      : isActive
                        ? "font-bold text-foreground"
                        : "text-foreground/80 hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isOverlay
                    ? "text-white/80 hover:text-white"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CurrencySwitcher variant={isOverlay ? "overlay" : "default"} />
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label={isAuthenticated ? "Account settings" : "Log in"}
            className={cn(
              "flex size-8 items-center justify-center rounded-full border transition-colors",
              isOverlay
                ? "border-white/35 bg-white/10 text-white hover:bg-white/20"
                : "border-border bg-muted text-muted-foreground hover:text-foreground",
            )}
            title={isAuthenticated ? user?.fullName : "Log in"}
          >
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
