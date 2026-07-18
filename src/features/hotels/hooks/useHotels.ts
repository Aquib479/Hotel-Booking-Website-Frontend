import { useEffect, useState } from "react";
import { getHotels } from "../api";
import type { Hotel, HotelSearchParams } from "../types";
import { ApiError } from "@/services/api";

export function useHotels(params?: HotelSearchParams) {
  const [data, setData] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const query = params?.query ?? "";
  const city = params?.city ?? "";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const hotels = await getHotels({
          query: query || undefined,
          city: city || undefined,
        });
        if (!cancelled) setData(hotels);
      } catch (err) {
        if (!cancelled) {
          setData([]);
          setError(err instanceof ApiError ? err.message : "Failed to load hotels");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [query, city]);

  return { data, isLoading, error };
}
