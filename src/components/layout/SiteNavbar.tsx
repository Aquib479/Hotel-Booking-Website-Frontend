import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CurrencySwitcher } from "@/components/common/CurrencySwitcher";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { AccountMenuButton } from "@/features/account/components/AccountMenuButton";
import { useLanguage } from "@/context/LanguageContext";
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
  const { t } = useLanguage();
  const isHome = location.pathname === "/";
  const isInline = variant === "inline";
  const [scrolled, setScrolled] = useState(false);
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

  const isTransparentHome = !isInline && isHome && !scrolled;

  return (
    <header
      className={cn(
        "z-[60] w-full transition-[background-color,border-color,box-shadow,backdrop-filter,transform] duration-300",
        !isInline && (isHome ? "fixed top-0" : "sticky top-0"),
        isTransparentHome
          ? "border-b border-transparent bg-transparent"
          : "border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-md",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link
          to="/"
          aria-label={t("nav.homeAria")}
          className="inline-flex shrink-0 items-center"
        >
          <img
            src="/resthalf-logo.png"
            alt="RestHalf.com"
            className="h-12 w-auto max-w-[240px] origin-left scale-x-110 rounded-md object-contain object-left sm:h-14 sm:max-w-[280px]"
          />
        </Link>

        <nav
          aria-label={t("nav.aria")}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {SITE_NAV_LINKS.map((link) =>
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <NavLink
                key={link.id}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "border-b-2 pb-0.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-sky-400 font-semibold text-foreground"
                      : "border-transparent text-foreground/80 hover:text-foreground",
                  )
                }
              >
                {t(`nav.${link.id}`)}
              </NavLink>
            ) : (
              <a
                key={link.id}
                href={link.href}
                className="border-b-2 border-transparent pb-0.5 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {t(`nav.${link.id}`)}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <CurrencySwitcher />
          <AccountMenuButton />
        </div>
      </div>
    </header>
  );
}
