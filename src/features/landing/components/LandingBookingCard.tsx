import { useNavigate } from "react-router-dom";
import { SearchPanel, buildSearchParams } from "@/components/common/search";

export function LandingBookingCard() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-brand/20 via-violet-200/40 to-sky-200/30 blur-sm" />
      <div className="relative rounded-md border border-border/80 bg-white p-5 shadow-xl shadow-brand/5 sm:p-6">
        <SearchPanel
          variant="landing"
          submitLabel="Search hotels"
          onSubmit={(values) =>
            navigate(`/search?${buildSearchParams(values).toString()}`)
          }
        />
      </div>
    </div>
  );
}
