import { Clock, Globe, Plane, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LANDING_BENEFITS } from "../constants";

const ICONS = {
  clock: Clock,
  plane: Plane,
  zap: Zap,
  globe: Globe,
} as const;

export function LandingBenefits() {
  return (
    <section className="border-t border-border bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Why travelers choose RestHalf
          </h2>
          <p className="mt-2 text-muted-foreground">
            Flexible hotel booking designed for modern travel — not traditional nightly stays only.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_BENEFITS.map((benefit) => {
            const Icon = ICONS[benefit.icon];
            return (
              <Card key={benefit.title} className="bg-muted/20 transition-shadow hover:shadow-md">
                <CardContent>
                  <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                    <Icon className="size-5 text-brand" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
