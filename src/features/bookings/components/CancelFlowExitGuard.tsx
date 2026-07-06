import { useEffect } from "react";

interface CancelFlowExitGuardProps {
  enabled: boolean;
  children: React.ReactNode;
}

/**
 * Lightweight exit guard — uses beforeunload only (works with BrowserRouter).
 * In-app navigation is handled by explicit "Never mind, keep my booking" in CancelFlowLayout.
 */
export function CancelFlowExitGuard({ enabled, children }: CancelFlowExitGuardProps) {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);

  return <>{children}</>;
}
