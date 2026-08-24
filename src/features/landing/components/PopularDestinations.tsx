import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { POPULAR_DESTINATIONS } from "../constants";

export function PopularDestinations() {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <section className="relative z-10 px-4 pb-16 pt-6 sm:px-8 sm:pb-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-7 text-center">
          <h2 className="text-[1.35rem] font-semibold tracking-tight text-slate-600 sm:text-[1.5rem]">
            Explore popular destinations
          </h2>
          <div className="mx-auto mt-2.5 h-[3px] w-14 rounded-full bg-teal-400" />
        </div>

        <div className="relative flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            aria-label="Previous destinations"
            onClick={() => scroll(-1)}
            className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white sm:inline-flex"
          >
            <ChevronLeft className="size-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex flex-1 snap-x snap-mandatory gap-5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {POPULAR_DESTINATIONS.map((dest) => (
              <button
                key={dest.city}
                type="button"
                onClick={() =>
                  navigate(
                    `/search?${new URLSearchParams({
                      mode: "stay",
                      location: dest.city,
                      country: dest.country,
                    }).toString()}`,
                  )
                }
                className="flex w-[138px] shrink-0 snap-start flex-col items-center rounded-[1.35rem] bg-white px-4 py-6 text-center shadow-[0_8px_24px_rgba(15,23,42,0.06)] ring-1 ring-white transition hover:-translate-y-0.5 hover:shadow-md sm:w-[154px]"
              >
                <img
                  src={dest.image}
                  alt={`${dest.city} landmark`}
                  className="h-20 w-20 object-contain sm:h-[5.5rem] sm:w-[5.5rem]"
                />
                <p className="mt-4 text-[15px] font-bold text-slate-900">{dest.city}</p>
                <p className="mt-0.5 text-[12px] text-slate-400">{dest.country}</p>
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next destinations"
            onClick={() => scroll(1)}
            className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow-sm ring-1 ring-slate-200/80 transition hover:bg-white sm:inline-flex"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
