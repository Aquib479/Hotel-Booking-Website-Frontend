import { Link, NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE_NAV_LINKS } from "./site-nav";

type SiteNavbarVariant = "default" | "overlay";

interface SiteNavbarProps {
  variant?: SiteNavbarVariant;
}

export function SiteNavbar({ variant = "default" }: SiteNavbarProps) {
  const isOverlay = variant === "overlay";

  return (
    <header
      className={cn(
        "z-50 w-full",
        isOverlay
          ? "absolute top-0 bg-transparent"
          : "sticky top-0 border-b border-border bg-white/95 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-4 sm:px-12">
        <Link
          to="/"
          className={cn(
            "text-xl font-bold tracking-tight sm:text-2xl",
            isOverlay ? "text-foreground" : "text-foreground"
          )}
        >
          Neer
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
                    isActive
                      ? "text-foreground font-bold"
                      : "text-foreground"
                  )
                }
              >
                {link.label}
              </NavLink>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium transition-colors"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* {!isOverlay && (
            <Button
              variant="outline"
              className="hidden rounded-full border-border px-4 text-sm sm:inline-flex"
            >
              <Sparkles className="size-4 text-brand" />
              Ask AJ
            </Button>
          )} */}
          <Button
            variant="outline"
            className={cn(
              "hidden rounded-full px-5 text-sm font-medium sm:inline-flex",
              isOverlay && "border-foreground/20 bg-transparent backdrop-blur-sm hover:bg-transparent"
            )}
          >
            Become a Host
          </Button>
          <button
            type="button"
            aria-label="Open profile"
            className={cn(
              "flex size-8 items-center justify-center rounded-full border transition-colors",
              isOverlay
                ? "border-foreground/15 bg-transparent text-foreground hover:bg-transparent hover:text-foreground"
                : "border-border bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
