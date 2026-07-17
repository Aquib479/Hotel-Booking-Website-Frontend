import { useCallback, useEffect, useState } from "react";
import { fetchCommissionSummary, fetchRecentWalkIns } from "../api";
import { useStaffAuth } from "./useStaffAuth";
import type { CommissionSummary, WalkInRecord } from "../types";

export function useCommissionSummary() {
  const { staff } = useStaffAuth();
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [recentWalkIns, setRecentWalkIns] = useState<WalkInRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!staff) return;

    setIsLoading(true);
    try {
      const [sum, recent] = await Promise.all([
        fetchCommissionSummary(staff),
        fetchRecentWalkIns(staff),
      ]);
      setSummary(sum);
      setRecentWalkIns(recent);
    } finally {
      setIsLoading(false);
    }
  }, [staff]);

  useEffect(() => {
    void load();
  }, [load]);

  return { summary, recentWalkIns, isLoading, refresh: load };
}
