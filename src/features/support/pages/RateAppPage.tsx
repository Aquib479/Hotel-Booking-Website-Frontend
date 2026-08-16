import { useState } from "react";
import { Star } from "lucide-react";
import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RATE_APP_CONTENT } from "../constants/sitePages";
import { cn } from "@/lib/utils";

export function RateAppPage() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main>
      <div className="mx-auto max-w-lg px-4 py-10 sm:px-8 sm:py-14">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {RATE_APP_CONTENT.title}
          </h1>
          <p className="mt-3 text-muted-foreground">{RATE_APP_CONTENT.intro}</p>
        </header>

        <div className="mt-10">
          {submitted ? (
            <SectionCard title="Thank you" description="We appreciate your feedback.">
              <p className="text-sm text-muted-foreground">
                Your rating helps us improve RestHalf for every traveler.
              </p>
            </SectionCard>
          ) : (
            <SectionCard title="How are we doing?" description="Tap a star, then share optional notes.">
              <div
                className="flex justify-center gap-1"
                role="radiogroup"
                aria-label="App rating"
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= (hover || rating);
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={rating === value}
                      aria-label={`${value} star${value === 1 ? "" : "s"}`}
                      className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(value)}
                    >
                      <Star
                        className={cn(
                          "size-8",
                          active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <Textarea
                className="mt-4"
                rows={4}
                placeholder="What could we improve? (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <Button
                className="mt-4 w-full rounded-xl"
                disabled={rating === 0}
                onClick={() => setSubmitted(true)}
              >
                Submit rating
              </Button>

              <div className="mt-6 space-y-2 border-t border-border pt-4">
                <p className="text-xs font-medium text-muted-foreground">Or rate us on the stores</p>
                {RATE_APP_CONTENT.storeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    className="block text-sm font-medium text-brand hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </main>
  );
}
