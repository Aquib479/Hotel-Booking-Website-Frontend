import { useLanguage } from "@/context/LanguageContext";

export function SearchBar() {
  const { t } = useLanguage();
  return <div className="rounded-md border p-3">{t("common.search")}</div>;
}
