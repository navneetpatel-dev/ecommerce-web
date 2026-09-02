import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { API } from "@/shared/constants/apiRoutes";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/errors";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS, REFRESH_TIMEOUT_MS } from "@/shared/constants/timing";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { ApiError } from "@/shared/types/apiError.types";
import {
  isDefinitiveAuthErrorCode,
  isTransientNetworkError,
} from "@/shared/utils/authSessionError";

const BASE_URL = CLIENT_API_BASE_URL;

interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

type RequestConfig = {
  timeoutMs?: number;
  /** Prevents infinite 401 → refresh → retry loops. */
  retriedAfter401?: boolean;
};

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

function persistAccessToken(accessToken: string) {
  getApiSessionAdapter().persistAccessToken(accessToken);
}

function clearPersistedSession() {
  getApiSessionAdapter().clearSession();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function fetchWithTimeout(
  path: string,
  options: RequestInit,
  timeoutMs: number = API_TIMEOUT_MS,
): Promise<Response> {
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    cache: "no-store",
    credentials: "include",
    signal: AbortSignal.timeout(timeoutMs),
  });
}

async function performRefreshAttempt(): Promise<
  "ok" | "auth_failure" | "transient_failure"
> {
  try {
    const res = await fetch(`${BASE_URL}${API.auth.refresh}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });

    if (!res.ok) {
      let code: string | undefined;
      try {
        const body = await parseResponseBody(res);
        if (body && !("success" in body && body.success)) {
          code = (body as ApiFailure).error?.code;
        }
      } catch {
        /* non-JSON error body */
      }
      if (res.status === 401 || isDefinitiveAuthErrorCode(code)) {
        return "auth_failure";
      }
      return "transient_failure";
    }

    const body = await parseResponseBody(res);
    if (body && "success" in body && body.success) {
      persistAccessToken((body.data as { accessToken: string }).accessToken);
      return "ok";
    }
    return "auth_failure";
  } catch (err) {
    if (isTransientNetworkError(err)) return "transient_failure";
    return "auth_failure";
  }
}

async function refreshSessionWithRetries(): Promise<void> {
  const throwSessionExpired = () =>
    new ApiError(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.SESSION_EXPIRED);
  const throwTransient = () =>
    new ApiError(
      ERROR_CODES.REQUEST_FAILED,
      "Could not reach the server. Please try again.",
    );

  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const outcome = await performRefreshAttempt();
    if (outcome === "ok") return;
    if (outcome === "auth_failure") {
      clearPersistedSession();
      throw throwSessionExpired();
    }
    if (attempt < maxAttempts - 1) {
      await sleep(500 * (attempt + 1));
    }
  }

  throw throwTransient();
}

/** Refreshes the access token once; throws on definitive auth failure. */
async function refreshSessionOrThrow(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return;
  }

  isRefreshing = true;
  refreshPromise = refreshSessionWithRetries().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  await refreshPromise;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  config?: RequestConfig,
): Promise<T> {
  const token = getApiSessionAdapter().getAccessToken();

  const res = await fetchWithTimeout(
    path,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `${BEARER_PREFIX}${token}` } : {}),
        ...options.headers,
      },
    },
    config?.timeoutMs,
  );

  if (res.status === 401) {
    if (config?.retriedAfter401) {
      throw new ApiError(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.SESSION_EXPIRED);
    }
    await refreshSessionOrThrow();
    return request<T>(path, options, { ...config, retriedAfter401: true });
  }

  if (res.status === 204 || res.status === 205) {
    return undefined as T;
  }

  const body = await parseResponseBody(res);
  return assertSuccess<T>(body, res.status);
}

async function requestWithResponse<T>(
  path: string,
  options: RequestInit = {},
  config?: RequestConfig,
): Promise<ApiSuccess<T>> {
  const token = getApiSessionAdapter().getAccessToken();

  const res = await fetchWithTimeout(
    path,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `${BEARER_PREFIX}${token}` } : {}),
        ...options.headers,
      },
    },
    config?.timeoutMs,
  );

  if (res.status === 401) {
    if (config?.retriedAfter401) {
      throw new ApiError(ERROR_CODES.UNAUTHORIZED, ERROR_MESSAGES.SESSION_EXPIRED);
    }
    await refreshSessionOrThrow();
    return requestWithResponse<T>(path, options, { ...config, retriedAfter401: true });
  }

  const body = await parseResponseBody(res);
  const data = assertSuccess<T>(body, res.status);
  return { success: true, data, meta: (body as ApiSuccess<T>).meta };
}

export const apiClient = {
  get: <T>(path: string, config?: RequestConfig) => request<T>(path, {}, config),
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
