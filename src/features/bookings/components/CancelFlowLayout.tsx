import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CancelFlowLayoutProps {
  bookingId: string;
  children: ReactNode;
  footer: ReactNode;
  className?: string;
}

export function CancelFlowLayout({
  bookingId,
  children,
  footer,
  className,
}: CancelFlowLayoutProps) {
  return (
    <div className={cn("mx-auto flex min-h-[70vh] max-w-lg flex-col px-4 py-8 sm:px-6", className)}>
      <div className="flex-1">{children}</div>

      <div className="mt-8 space-y-4 border-t border-border pt-6">{footer}</div>

      <p className="mt-4 text-center">
        <Link
          to={`/bookings/${bookingId}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Never mind, keep my booking
        </Link>
      </p>
    </div>
  );
}
