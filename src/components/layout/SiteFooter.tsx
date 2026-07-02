import { Link } from "react-router-dom";
import { Globe, Mail, Share2 } from "lucide-react";
import { FOOTER_LINKS } from "./site-nav";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#0f172a] px-6 py-14 text-slate-300 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <p className="text-2xl font-bold text-white">RestHalf</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              Flexible hotel rest for layovers and short stays — 12-hour slots or full overnight
              bookings, worldwide.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        to={link.href}
                        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-800 pt-6">
          {[Share2, Globe, Mail].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label="Social link"
              className="text-slate-400 transition-colors hover:text-white"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
