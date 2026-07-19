import { LandingHeroContent } from "./LandingHeroContent";
import { LandingBookingCard } from "./LandingBookingCard";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100dvh-4.25rem)] flex-col overflow-x-hidden"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-sky-50"
        aria-hidden
      />
      <div
        className="absolute -right-32 top-0 size-96 rounded-full bg-brand/5 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -left-24 bottom-0 size-80 rounded-full bg-sky-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-6 sm:px-8 sm:py-8">
        <div className="grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <LandingHeroContent />
          <LandingBookingCard />
        </div>
      </div>
    </section>
  );
}
