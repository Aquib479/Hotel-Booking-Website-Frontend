import { zh } from "./client";
import type { PriceResponse } from "./types";

/** Mandatory pre-book price check for a recommendation. */
export async function priceRecommendation(
  hotelId: string,
  token: string,
  recommendationId: string,
  options?: { correlationId?: string }
) {
  return zh.get<PriceResponse>(
    `/api/hotel/${encodeURIComponent(hotelId)}/${encodeURIComponent(token)}/price/recommendation/${encodeURIComponent(recommendationId)}`,
    { correlationId: options?.correlationId }
  );
}
