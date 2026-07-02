import type { BookingLane } from "@/lib/booking/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CancellationPolicySummaryProps {
  lane: BookingLane;
  supplierName?: string;
}

export function CancellationPolicySummary({ lane, supplierName }: CancellationPolicySummaryProps) {
  const [expanded, setExpanded] = useState(false);

  const headline =
    lane === "direct"
      ? "Free cancellation up to 2 hours before slot start"
      : "Subject to partner cancellation policy";

  const fullPolicy =
    lane === "direct"
      ? [
          "Cancel free of charge up to 2 hours before your slot begins.",
          "Cancellations within 2 hours are charged the full slot rate.",
          "No-shows are non-refundable.",
          "Refunds are processed within 5–7 business days to your original payment method.",
        ]
      : [
          `This rate is provided by ${supplierName ?? "our partner supplier"}.`,
          "Cancellation and refund rules follow the supplier's policy at time of booking.",
          "RestHalf cannot override partner policies once the handoff is complete.",
          "Contact RestHalf support if you need help before completing payment with the partner.",
        ];

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cancellation policy</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{headline}</p>
        </div>
        <ChevronDown
          className={cn("size-4 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")}
        />
      </button>
      {expanded && (
        <ul className="mt-3 space-y-2 border-t border-border pt-3 text-sm text-muted-foreground">
          {fullPolicy.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-brand">•</span>
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
