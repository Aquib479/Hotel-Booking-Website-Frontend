import { useEffect, useState } from "react";
import { getRoomsByHotel } from "../api";
import type { Room } from "../types";
import { ApiError } from "@/services/api";

export function useHotelRooms(hotelId?: string) {
  const [data, setData] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(hotelId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hotelId) {
      setData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const rooms = await getRoomsByHotel(hotelId!);
        if (!cancelled) setData(rooms);
      } catch (err) {
        if (!cancelled) {
          setData([]);
          setError(
            err instanceof ApiError ? err.message : "Failed to load rooms"
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  return { data, isLoading, error };
}
