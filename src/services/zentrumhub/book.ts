import { zh } from "./client";
import { zentrumConfig } from "./config";
import type {
  BookRequest,
  BookResponse,
  BookingDetailsRequest,
  BookingDetailsResponse,
  CancelResponse,
} from "./types";

export async function bookInit(
  hotelId: string,
  token: string,
  request: BookRequest,
  options?: { correlationId?: string }
) {
  const body: BookRequest = {
    ...request,
    bookingTag: {
      ...request.bookingTag,
      onHold: true,
    },
  };

  return zh.post<BookResponse>(
    `/api/hotel/${encodeURIComponent(hotelId)}/${encodeURIComponent(token)}/book`,
    body,
    { correlationId: options?.correlationId }
  );
}

export async function book(
  hotelId: string,
  token: string,
  request: BookRequest,
  options?: { correlationId?: string }
) {
  return zh.post<BookResponse>(
    `/api/hotel/${encodeURIComponent(hotelId)}/${encodeURIComponent(token)}/book`,
    bodyWithoutHold(request),
    { correlationId: options?.correlationId }
  );
}

function bodyWithoutHold(request: BookRequest): BookRequest {
  if (!request.bookingTag) return request;
  const { onHold: _onHold, ...restTag } = request.bookingTag;
  return {
    ...request,
    bookingTag: Object.keys(restTag).length ? restTag : undefined,
  };
}

export async function getBookingDetails(
  bookingId: string,
  options?: { correlationId?: string; channelId?: string }
) {
  const body: BookingDetailsRequest = {
    bookingId,
    channelId: options?.channelId ?? zentrumConfig.channelId,
  };

  return zh.post<BookingDetailsResponse>("/api/hotel/getBookingDetails", body, {
    correlationId: options?.correlationId,
  });
}

/**
 * Ghost-booking recovery: poll details for up to ~5 minutes.
 */
export async function pollBookingDetails(
  bookingId: string,
  options: {
    correlationId: string;
    signal?: AbortSignal;
    intervalMs?: number;
    maxAttempts?: number;
  }
): Promise<BookingDetailsResponse> {
  const intervalMs = options.intervalMs ?? 12_000;
  const maxAttempts = options.maxAttempts ?? 25;
  let last: BookingDetailsResponse | undefined;

  for (let i = 0; i < maxAttempts; i++) {
    if (options.signal?.aborted) {
      throw new DOMException("Booking details polling aborted", "AbortError");
    }

    const { data } = await getBookingDetails(bookingId, {
      correlationId: options.correlationId,
    });
    last = data;

    const status = (data.bookingStatus ?? "").toLowerCase();
    if (
      status.includes("confirm") ||
      status.includes("success") ||
      status === "booked" ||
      Boolean(data.hotelConfirmationNumber || data.providerConfirmationNumber)
    ) {
      return data;
    }

    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, intervalMs);
      options.signal?.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new DOMException("Booking details polling aborted", "AbortError"));
        },
        { once: true }
      );
    });
  }

  return last ?? { bookingId };
}

export async function getCancellationFee(
  bookingId: string,
  options?: { correlationId?: string }
) {
  const params = new URLSearchParams({ bookingId });
  return zh.get<unknown>(`/api/hotel/bookingcancellationFee?${params}`, {
    correlationId: options?.correlationId,
  });
}

export async function cancelBooking(
  bookingId: string,
  options?: { correlationId?: string }
) {
  return zh.post<CancelResponse>(
    `/api/hotel/booking/${encodeURIComponent(bookingId)}/cancel`,
    { channelId: zentrumConfig.channelId },
    { correlationId: options?.correlationId }
  );
}
