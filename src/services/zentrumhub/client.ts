import { assertZentrumConfigured, zentrumConfig } from "./config";

export class ZentrumApiError extends Error {
  readonly status: number;
  readonly body?: unknown;
  readonly correlationId: string;

  constructor(status: number, message: string, correlationId: string, body?: unknown) {
    super(message);
    this.name = "ZentrumApiError";
    this.status = status;
    this.correlationId = correlationId;
    this.body = body;
  }
}

export function createCorrelationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `zh-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

type Base = "nexus" | "autosuggest";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Reuse the same id across search → book → cancel */
  correlationId?: string;
  base?: Base;
};

function resolveBase(base: Base): string {
  return base === "autosuggest" ? zentrumConfig.autosuggestBase : zentrumConfig.nexusBase;
}

async function parseErrorBody(res: Response): Promise<{ message: string; body?: unknown }> {
  let body: unknown;
  let message = res.statusText || "Request failed";
  try {
    body = await res.json();
    const err = body as {
      error?: { message?: string; code?: string };
      message?: string;
    };
    if (err.error?.message) message = err.error.message;
    else if (typeof err.message === "string") message = err.message;
  } catch {
    /* ignore */
  }
  return { message, body };
}

export async function zentrumRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<{ data: T; correlationId: string }> {
  assertZentrumConfigured();

  const {
    body,
    correlationId = createCorrelationId(),
    base = "nexus",
    headers: customHeaders,
    ...rest
  } = options;

  const headers = new Headers(customHeaders);
  headers.set("accountId", zentrumConfig.accountId);
  headers.set("apiKey", zentrumConfig.apiKey);
  headers.set("correlationId", correlationId);
  headers.set("Accept", "application/json");

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${resolveBase(base)}${path}`, {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ZentrumApiError(0, "Network error contacting ZentrumHub", correlationId);
  }

  if (!res.ok) {
    const { message, body: errBody } = await parseErrorBody(res);
    throw new ZentrumApiError(res.status, message, correlationId, errBody);
  }

  if (res.status === 204) {
    return { data: undefined as T, correlationId };
  }

  return { data: (await res.json()) as T, correlationId };
}

export const zh = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body" | "method">) =>
    zentrumRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body" | "method">) =>
    zentrumRequest<T>(path, { ...options, method: "POST", body }),

  delete: <T>(path: string, options?: Omit<RequestOptions, "body" | "method">) =>
    zentrumRequest<T>(path, { ...options, method: "DELETE" }),
};
