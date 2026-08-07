import { LandingSearchBar } from "./LandingSearchBar";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=80";

export function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-dvh flex-col">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full scale-105 object-cover object-center animate-hero-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/35" />
        <div className="pointer-events-none absolute -left-24 top-1/4 size-[28rem] rounded-full bg-brand/25 blur-3xl animate-hero-glow" />
        <div className="pointer-events-none absolute -right-16 bottom-1/4 size-[22rem] rounded-full bg-white/10 blur-3xl animate-hero-glow-delayed" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
        <div className="max-w-3xl">
          <p className="animate-hero-fade-up text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            RestHalf
          </p>
          <h1 className="animate-hero-fade-up mt-4 text-2xl font-semibold leading-tight tracking-tight text-white/95 sm:text-3xl md:text-4xl [animation-delay:120ms]">
            Discover Your Perfect Escape
          </h1>
          <p className="animate-hero-fade-up mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg [animation-delay:220ms]">
            Your journey starts here — Plan your trip and book the perfect
            hotel.
          </p>
        </div>

        <div className="relative z-30 mt-10 w-full">
          <LandingSearchBar />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/35 p-1.5">
          <span className="size-1.5 rounded-full bg-white/90 animate-hero-scroll-dot" />
        </div>
      </div>
    </section>
  );
}
