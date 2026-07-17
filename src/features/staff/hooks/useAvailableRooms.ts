import { useCallback, useEffect, useState } from "react";
import { fetchAvailableRooms } from "../api";
import { ROOM_REFRESH_INTERVAL_MS } from "../constants";
import type { AvailableRoomsState } from "../types";

export function useAvailableRooms(propertyId: string | undefined) {
  const [state, setState] = useState<AvailableRoomsState>({
    rooms: [],
    isLoading: true,
    error: null,
    lastRefreshedAt: null,
  });

  const load = useCallback(async () => {
    if (!propertyId) {
      setState({ rooms: [], isLoading: false, error: null, lastRefreshedAt: null });
      return;
    }

    setState((s) => ({ ...s, isLoading: true, error: null }));

    try {
      const rooms = await fetchAvailableRooms(propertyId);
      setState({
        rooms,
        isLoading: false,
        error: null,
        lastRefreshedAt: new Date(),
      });
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Could not refresh room availability",
      }));
    }
  }, [propertyId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!propertyId) return;
    const interval = window.setInterval(() => void load(), ROOM_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [propertyId, load]);

  return { ...state, refresh: load };
}
