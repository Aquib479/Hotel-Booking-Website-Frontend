import { zh } from "./client";
import type { RoomsAndRatesResponse } from "./types";

export async function getRoomsAndRates(
  hotelId: string,
  token: string,
  options?: { correlationId?: string; body?: Record<string, unknown> }
) {
  return zh.post<RoomsAndRatesResponse>(
    `/api/hotel/${encodeURIComponent(hotelId)}/roomsandrates/${encodeURIComponent(token)}`,
    options?.body ?? {},
    { correlationId: options?.correlationId }
  );
}
