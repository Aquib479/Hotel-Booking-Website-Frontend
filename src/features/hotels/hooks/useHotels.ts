import { useMemo } from 'react';

export function useHotels() {
  return useMemo(
    () => ({
      data: [],
      isLoading: false,
      error: null,
    }),
    []
  );
}
