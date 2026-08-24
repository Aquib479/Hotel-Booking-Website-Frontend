import { HeroSection } from "@/features/landing";
import { LandingWaves } from "@/features/landing/components/LandingWaves";
import { PopularDestinations } from "@/features/landing/components/PopularDestinations";

export default function Home() {
  return (
    <div
      className="relative min-h-dvh overflow-x-hidden"
      style={{
        background:
          "radial-gradient(circle at 95% 10%, rgba(139, 92, 246, 0.25) 0%, transparent 50%), radial-gradient(circle at 5% 90%, rgba(34, 211, 238, 0.18) 0%, transparent 45%), radial-gradient(circle at 50% 40%, rgba(253, 224, 71, 0.05) 0%, rgba(244, 63, 94, 0.08) 35%, transparent 70%), #fbfbfe",
      }}
    >
      <LandingWaves />
      <div className="relative z-10 flex min-h-dvh flex-col">
        <HeroSection />
        <PopularDestinations />
      </div>
    </div>
  );
}
