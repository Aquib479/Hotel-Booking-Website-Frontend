const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "")
  ?? "http://localhost:3001";

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

async function parseError(res: Response): Promise<ApiError> {
  let body: unknown;
  let message = res.statusText || "Request failed";
  try {
    body = await res.json();
    const raw = (body as { message?: string | string[] }).message;
    if (Array.isArray(raw)) message = raw.join(", ");
    else if (typeof raw === "string") message = raw;
  } catch {
    /* ignore */
  }
  return new ApiError(res.status, message, body);
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Network error");
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, "body" | "method">) =>
    apiRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, "body" | "method">) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
};

export { API_BASE_URL };
