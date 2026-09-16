import { LandingSearchBar } from "./LandingSearchBar";

export function HeroSection() {
  return (
    <section id="home" className="relative flex flex-1 items-center justify-center px-4 pt-28 pb-4 sm:px-8 sm:pt-32 sm:pb-6">
      <div className="w-full max-w-[1080px]">
        <LandingSearchBar />
      </div>
    </section>
  );
}
