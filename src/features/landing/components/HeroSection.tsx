import { FeatureBadges } from "./FeatureBadges";
import { WatchReel } from "./WatchReel";
import { SocialProof } from "./SocialProof";
import { HeroSearchBar } from "./HeroSearchBar";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative z-10 flex min-h-screen flex-col">
        {" "}
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 pb-36 pt-8 text-center sm:px-10">
          <FeatureBadges />
          <SocialProof />

          <div className="mx-auto max-w-3xl">
            <h1 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-black">Rest when you need it. </span>
              <span className="font-normal text-white">Stay when you want.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/90 sm:text-lg italic">
              Book 12-hour rest slots or overnight stays at airport hotels and city properties
              worldwide.
            </p>
          </div>

          <div className="mt-10 sm:mt-12">
            <WatchReel />
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 z-20 px-6 sm:bottom-10 sm:px-10">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
