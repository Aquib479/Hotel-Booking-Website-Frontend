import { useNavigate } from "react-router-dom";
import { SearchPanel, buildSearchParams } from "@/components/common/search";

/** Kept for search-page / older imports — home uses LandingSearchBar. */
export function HeroSearchBar() {
  const navigate = useNavigate();

  return (
    <SearchPanel
      variant="hero"
      submitLabel="Search Hotel"
      onSubmit={(values) => navigate(`/search?${buildSearchParams(values).toString()}`)}
    />
  );
}
