import { useMemo } from 'react';

export function useHotelDetails(id?: string) {
  return useMemo(
    () => ({
      data: null,
      isLoading: false,
      error: null,
      id,
    }),
    [id]
  );
}
