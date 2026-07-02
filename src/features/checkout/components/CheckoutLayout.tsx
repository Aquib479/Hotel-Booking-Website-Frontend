import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CheckoutLayoutProps {
  children: ReactNode;
  summary: ReactNode;
  stickyCta?: ReactNode;
}

export function CheckoutLayout({ children, summary, stickyCta }: CheckoutLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>

      {/* Mobile: summary on top */}
      <div className="mb-6 lg:hidden">{summary}</div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="min-w-0 space-y-8">{children}</div>
        <div className="hidden lg:block">
          <div className="sticky top-24">{summary}</div>
        </div>
      </div>

      {stickyCta && (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-4 backdrop-blur-md lg:hidden"
          )}
        >
          {stickyCta}
        </div>
      )}

      {/* Spacer for sticky mobile CTA */}
      {stickyCta && <div className="h-24 lg:hidden" aria-hidden />}
    </div>
  );
}
