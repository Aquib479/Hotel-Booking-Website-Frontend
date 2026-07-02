import { Star } from "lucide-react";
import { REVIEW_AVATARS } from "../constants";

export function SocialProof() {
  return (
    <div className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-14 lg:flex">
      <div className="pointer-events-auto flex -space-x-3">
        {REVIEW_AVATARS.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className="size-11 rounded-full border-2 border-white object-cover shadow-sm"
            style={{ zIndex: REVIEW_AVATARS.length - index }}
          />
        ))}
      </div>
      <div className="pointer-events-auto flex flex-col items-center gap-1 text-white">
        <div className="flex items-center gap-1.5">
          <Star className="size-4 fill-white text-white" />
          <span className="text-lg font-semibold">4.9</span>
        </div>
        <a href="#reviews" className="text-xs underline underline-offset-2 opacity-90 hover:opacity-100">
          Based on 2.4M+ Reviews
        </a>
      </div>
    </div>
  );
}
