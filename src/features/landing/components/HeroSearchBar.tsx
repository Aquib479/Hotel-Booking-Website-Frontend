import { useNavigate } from "react-router-dom";
import { SearchPanel, buildSearchParams } from "@/components/common/search";
import { useLanguage } from "@/context/LanguageContext";

/** Kept for search-page / older imports — home uses LandingSearchBar. */
export function HeroSearchBar() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <SearchPanel
      variant="hero"
      submitLabel={t("landing.searchHotel")}
      onSubmit={(values) => navigate(`/search?${buildSearchParams(values).toString()}`)}
    />
  );
}
