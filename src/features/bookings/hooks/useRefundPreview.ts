import { useCallback, useEffect, useState } from "react";
import { fetchRefundPreview } from "../api";
import type { CancelReasonId, RefundPreview } from "../types";

export function useRefundPreview(
  bookingId: string | undefined,
  reason: CancelReasonId | null,
  enabled: boolean
) {
  const [preview, setPreview] = useState<RefundPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!bookingId || !reason) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRefundPreview(bookingId, reason);
      setPreview(result);
    } catch {
      setError("Couldn't calculate your refund. Please try again or contact support.");
      setPreview(null);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId, reason]);

  useEffect(() => {
    if (!enabled || !bookingId || !reason) {
      setPreview(null);
      setError(null);
      return;
    }
    void load();
  }, [enabled, bookingId, reason, load]);

  return { preview, isLoading, error, retry: load };
}
