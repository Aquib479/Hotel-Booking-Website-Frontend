import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { SearchPanel, buildSearchParams } from "@/components/common/search";

export function LandingBookingCard() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand/20 via-violet-200/40 to-sky-200/30 blur-sm" />
      <div className="relative rounded-2xl border border-border/80 bg-white p-5 shadow-xl shadow-brand/5 sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="mt-1 text-xl font-bold text-foreground">Find your rest stop</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Search airport hotels and city properties worldwide
            </p>
          </div>
          <div className="hidden rounded-full bg-emerald-50 p-2 sm:block">
            <ShieldCheck className="size-5 text-emerald-600" />
          </div>
        </div>

        <SearchPanel
          variant="landing"
          submitLabel="Search hotels"
          onSubmit={(values) => navigate(`/search?${buildSearchParams(values).toString()}`)}
        />

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Free cancellation on RestHalf Exclusive · No account required to search
        </p>
      </div>
    </div>
  );
}
