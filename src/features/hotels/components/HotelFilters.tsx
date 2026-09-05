import { useLanguage } from "@/context/LanguageContext";

export function HotelFilters() {
  const { t } = useLanguage();
  return <div className="rounded-md border p-3">{t("search.filters")}</div>;
}
