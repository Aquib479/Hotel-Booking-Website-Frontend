import { zh } from "./client";
import { zentrumConfig } from "./config";
import type {
  GetHotelContentRequest,
  GetHotelContentResponse,
  GuestReviewsRequest,
  GuestReviewsResponse,
} from "./types";

/** Must match HotelContent.Contracts.ContentField enum exactly. */
const DEFAULT_CONTENT_FIELDS = [
  "Basic",
  "Facilities",
  "Descriptions",
  "Images",
  "Reviews",
  "Neighbourhoods",
  "Policies",
] as const;

export async function getHotelContent(
  hotelIds: string[],
  options?: { correlationId?: string; contentFields?: GetHotelContentRequest["contentFields"] }
) {
  const body: GetHotelContentRequest = {
    channelId: zentrumConfig.channelId,
    culture: zentrumConfig.culture,
    hotelIds,
    contentFields: options?.contentFields ?? [...DEFAULT_CONTENT_FIELDS],
  };

  return zh.post<GetHotelContentResponse>(
    "/api/content/HotelContent/getHotelContent",
    body,
    { correlationId: options?.correlationId }
  );
}

/** Paginated guest reviews for a single hotel (richer than nested content snippets). */
export async function getGuestReviews(
  hotelId: string,
  options?: {
    correlationId?: string;
    providerName?: string | null;
    paginationToken?: string | null;
  }
) {
  const body: GuestReviewsRequest = {
    channelId: zentrumConfig.channelId,
    culture: zentrumConfig.culture,
    hotelId,
    providerName: options?.providerName ?? undefined,
    paginationToken: options?.paginationToken ?? undefined,
  };

  return zh.post<GuestReviewsResponse>(
    "/api/content/HotelContent/guestReviews",
    body,
    { correlationId: options?.correlationId }
  );
}
