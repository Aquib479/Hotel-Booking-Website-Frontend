import { Star } from "lucide-react";
import { REVIEW_AVATARS, TRUST_STATS } from "../constants";

export function LandingHeroContent() {
  return (
    <div className="flex flex-col justify-center">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
        <span className="size-1.5 rounded-full bg-brand" />
        Book by the hour, not the night
      </div>

      <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        Rest when you need.
        <span className="mt-1 block bg-linear-to-r from-brand to-violet-500 bg-clip-text text-transparent">
          Stay when you want.
        </span>
      </h1>

      <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
        12-hour rest slots and overnight stays at airport hotels — built for layover travelers,
        business trips, and anyone who needs flexible hotel time.
      </p>

      <div className="mt-6 hidden grid-cols-3 gap-3 border-y border-border py-4 sm:gap-4 sm:py-5 lg:grid">
        {TRUST_STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-lg font-bold text-foreground sm:text-xl">{stat.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 hidden items-center gap-3 sm:mt-6 sm:gap-4 lg:flex">
        <div className="flex -space-x-2">
          {REVIEW_AVATARS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className="size-8 rounded-full border-2 border-white object-cover shadow-sm sm:size-9"
              style={{ zIndex: REVIEW_AVATARS.length - i }}
            />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="font-semibold text-foreground">4.9</span>
          <span className="text-xs text-muted-foreground sm:text-sm">from 120K+ reviews</span>
        </div>
      </div>
    </div>
  );
}
