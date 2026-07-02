import { FEATURE_BADGES } from "../constants";

export function FeatureBadges() {
  return (
    <div className="pointer-events-none absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 lg:left-14 lg:flex">
      {FEATURE_BADGES.map((badge) => (
        <div
          key={badge}
          className="pointer-events-auto relative flex items-center rounded-full border border-white/40 bg-white/15 py-2.5 pl-6 pr-5 text-xs font-medium text-white backdrop-blur-md sm:text-sm"
        >
          <span
            aria-hidden
            className="absolute -left-1.5 top-1/2 size-3 -translate-y-1/2 rotate-45 border-b border-l border-white/40 bg-white/15"
          />
          {badge}
        </div>
      ))}
    </div>
  );
}
