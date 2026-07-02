import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import type { NoDraftReason } from "../types";

interface NoActiveDraftStateProps {
  reason: NoDraftReason;
  searchHref?: string;
}

const COPY: Record<NoDraftReason, { title: string; body: string; cta: string }> = {
  missing: {
    title: "No active booking",
    body: "We couldn't find an active booking. Start a new search to book a rest slot or stay.",
    cta: "Back to search",
  },
  expired: {
    title: "Your slot hold expired",
    body: "Someone else may have booked it — search again to check availability and reserve a new slot.",
    cta: "Search again",
  },
};

export function NoActiveDraftState({ reason, searchHref = "/search" }: NoActiveDraftStateProps) {
  const copy = COPY[reason];

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
      <p className="mt-3 text-muted-foreground">{copy.body}</p>
      <Button asChild className="mt-8 rounded-xl px-8">
        <Link to={searchHref}>{copy.cta}</Link>
      </Button>
    </main>
  );
}
