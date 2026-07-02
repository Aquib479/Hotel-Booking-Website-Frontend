import { useNavigate } from "react-router-dom";
import { SearchPanel, buildSearchParams } from "@/components/common/search";

export function HeroSearchBar() {
  const navigate = useNavigate();

  return (
    <SearchPanel
      variant="hero"
      submitLabel="Search"
      onSubmit={(values) => navigate(`/search?${buildSearchParams(values).toString()}`)}
    />
  );
}
