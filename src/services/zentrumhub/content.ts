import { zh } from "./client";
import { zentrumConfig } from "./config";
import type { GetHotelContentRequest, GetHotelContentResponse } from "./types";

/** Must match HotelContent.Contracts.ContentField enum exactly. */
const DEFAULT_CONTENT_FIELDS = [
  "Basic",
  "Facilities",
  "Descriptions",
  "Images",
  "Reviews",
  "Neighbourhoods",
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
