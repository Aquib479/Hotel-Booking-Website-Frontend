import { zh } from "./client";
import { zentrumConfig } from "./config";
import type {
  AvailabilityAsyncResponse,
  AvailabilityInitRequest,
  AvailabilityInitResponse,
} from "./types";

export async function searchInit(
  request: Omit<AvailabilityInitRequest, "channelId" | "currency" | "culture"> &
    Partial<Pick<AvailabilityInitRequest, "channelId" | "currency" | "culture">>,
  options?: { correlationId?: string }
) {
  const body: AvailabilityInitRequest = {
    channelId: request.channelId ?? zentrumConfig.channelId,
    currency: request.currency ?? zentrumConfig.defaultCurrency,
    culture: request.culture ?? zentrumConfig.culture,
    checkIn: request.checkIn,
    checkOut: request.checkOut,
    occupancies: request.occupancies,
    circularRegion: request.circularRegion,
    polygonalRegion: request.polygonalRegion,
    multiPolygonalRegion: request.multiPolygonalRegion,
    hotelIds: request.hotelIds,
    nationality: request.nationality,
    countryOfResidence: request.countryOfResidence,
    destinationCountryCode: request.destinationCountryCode,
  };

  return zh.post<AvailabilityInitResponse>("/api/hotel/availability/init", body, {
    correlationId: options?.correlationId,
  });
}

export async function pollSearchResults(
  token: string,
  options?: { nextResultsKey?: string | null; correlationId?: string }
) {
  const params = new URLSearchParams();
  if (options?.nextResultsKey) {
    params.set("nextResultsKey", options.nextResultsKey);
  }
  const qs = params.toString();
  const path = `/api/hotel/availability/async/${encodeURIComponent(token)}/results${
    qs ? `?${qs}` : ""
  }`;

  return zh.get<AvailabilityAsyncResponse>(path, {
    correlationId: options?.correlationId,
  });
}

/**
 * Polls until status is Completed (or abort signal fires).
 * Merges hotels by id; replaces when isNewInResult is true (better rate).
 */
export async function pollUntilComplete(
  token: string,
  options: {
    correlationId: string;
    onBatch?: (
      batch: AvailabilityAsyncResponse,
      hotelsById: Map<string, NonNullable<AvailabilityAsyncResponse["hotels"]>[number]>
    ) => void | Promise<void>;
    signal?: AbortSignal;
    maxPolls?: number;
  }
): Promise<{
  hotels: NonNullable<AvailabilityAsyncResponse["hotels"]>;
  currency?: string | null;
  expectedHotelCount?: number;
  completedHotelCount?: number;
}> {
  const hotelsById = new Map<
    string,
    NonNullable<AvailabilityAsyncResponse["hotels"]>[number]
  >();
  let nextResultsKey: string | null | undefined;
  let currency: string | null | undefined;
  let expectedHotelCount: number | undefined;
  let completedHotelCount: number | undefined;
  const maxPolls = options.maxPolls ?? 120;

  for (let i = 0; i < maxPolls; i++) {
    if (options.signal?.aborted) {
      throw new DOMException("Search polling aborted", "AbortError");
    }

    const { data } = await pollSearchResults(token, {
      nextResultsKey,
      correlationId: options.correlationId,
    });

    currency = data.currency ?? currency;
    expectedHotelCount = data.expectedHotelCount ?? expectedHotelCount;
    completedHotelCount = data.completedHotelCount ?? completedHotelCount;
    nextResultsKey = data.nextResultsKey;

    for (const hotel of data.hotels ?? []) {
      if (!hotel.id) continue;
      const existing = hotelsById.get(hotel.id);
      if (!existing || hotel.isNewInResult) {
        hotelsById.set(hotel.id, hotel);
      }
    }

    await options.onBatch?.(data, hotelsById);

    if (data.status === "Completed") {
      break;
    }

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, zentrumConfig.pollIntervalMs);
      options.signal?.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Search polling aborted", "AbortError"));
        },
        { once: true }
      );
    });
  }

  return {
    hotels: Array.from(hotelsById.values()),
    currency,
    expectedHotelCount,
    completedHotelCount,
  };
}
