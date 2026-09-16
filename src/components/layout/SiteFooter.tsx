import { Link } from "react-router-dom";
import { Globe, Mail, Phone, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FOOTER_LINKS } from "./site-nav";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto bg-[#0f172a] px-6 py-14 text-slate-300 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(2,1fr)]">
          <div>
            <p className="text-2xl font-bold text-white">RestHalf</p>
            <a
              href="tel:+6281523902591"
              className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
            >
              <Phone className="size-4" />
              +62 81523902591
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">RestHalf</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.RestHalf.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {t(`footer.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-white">{t("footer.legal")}</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.Legal.map((link) => (
                <li key={link.id}>
                  <Link
                    to={link.href}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    {t(`footer.${link.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-end gap-4 border-t border-slate-800 pt-6">
          {[Share2, Globe, Mail].map((Icon, i) => (
            <a
              key={i}
              href="#"
              aria-label={t("footer.social")}
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
