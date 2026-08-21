import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { API } from "@/shared/constants/apiRoutes";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/errors";
import { BEARER_PREFIX } from "@/shared/constants/http";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

function persistAccessToken(accessToken: string) {
  getApiSessionAdapter().persistAccessToken(accessToken);
}

function clearPersistedSession() {
  getApiSessionAdapter().clearSession();
}

async function parseResponseBody(
  res: Response,
): Promise<ApiSuccess<unknown> | ApiFailure | null> {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as ApiSuccess<unknown> | ApiFailure;
  } catch {
    if (res.status === 429) {
      throw new ApiError(
        ERROR_CODES.RATE_LIMITED,
        text.trim().slice(0, 160) || ERROR_MESSAGES.RATE_LIMITED,
      );
    }
    throw new ApiError(
      ERROR_CODES.INVALID_RESPONSE,
      text.trim().slice(0, 160) || `Unexpected response (${res.status})`,
    );
  }
}

function assertSuccess<T>(
  body: ApiSuccess<unknown> | ApiFailure | null,
  status: number,
): T {
  if (!body) {
    throw new ApiError(
      ERROR_CODES.EMPTY_RESPONSE,
      `Empty response (${status})`,
    );
  }
  if (!("success" in body) || !body.success) {
    const failure = body as ApiFailure;
    throw new ApiError(
      failure.error?.code ?? ERROR_CODES.REQUEST_FAILED,
      failure.error?.message ?? `Request failed (${status})`,
      failure.error?.details,
    );
  }
  return body.data as T;
}

async function refreshAccessTokenAndRetry(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = fetch(`${BASE_URL}${API.auth.refresh}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then(async (res) => {
      if (!res.ok) {
        clearPersistedSession();
        return false;
      }
      const body = await parseResponseBody(res);
      if (body && "success" in body && body.success) {
        const data = body.data as { accessToken: string };
        persistAccessToken(data.accessToken);
        return true;
      }
      return false;
    })
    .catch(() => {
      clearPersistedSession();
      return false;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getApiSessionAdapter().getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${BEARER_PREFIX}${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessTokenAndRetry();
    if (refreshed) {
      return request<T>(path, options);
    }
    throw new ApiError(
      ERROR_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.SESSION_EXPIRED,
    );
  }

  // Soft-delete and similar endpoints return 204 with an empty body.
  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  const body = await parseResponseBody(res);
  return assertSuccess<T>(body, res.status);
}

async function requestWithResponse<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiSuccess<T>> {
  const token = getApiSessionAdapter().getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `${BEARER_PREFIX}${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessTokenAndRetry();
    if (refreshed) {
      return requestWithResponse<T>(path, options);
    }
    throw new ApiError(
      ERROR_CODES.UNAUTHORIZED,
      ERROR_MESSAGES.SESSION_EXPIRED,
    );
  }

  const body = await parseResponseBody(res);
  const data = assertSuccess<T>(body, res.status);
  return { success: true, data, meta: (body as ApiSuccess<T>).meta };
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  getWithResponse: <T>(path: string) => requestWithResponse<T>(path),
  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
      ...init,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { ApiError };
