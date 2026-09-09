import { getApiSessionAdapter } from "@/shared/api/sessionAdapter";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/errors";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { API_TIMEOUT_MS } from "@/shared/constants/timing";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { ApiError } from "@/shared/types/apiError.types";
import { assertSuccess, parseResponseBody, type ApiSuccess } from "./envelope";
import { refreshSessionOrThrow } from "./sessionRefresh";

const BASE_URL = CLIENT_API_BASE_URL;

export type RequestConfig = {
  timeoutMs?: number;
  /** Prevents infinite 401 → refresh → retry loops. */
  retriedAfter401?: boolean;
};

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

export async function request<T>(
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
      throw new ApiError(
        ERROR_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.SESSION_EXPIRED,
      );
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

export async function requestWithResponse<T>(
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
      throw new ApiError(
        ERROR_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.SESSION_EXPIRED,
      );
    }
    await refreshSessionOrThrow();
    return requestWithResponse<T>(path, options, {
      ...config,
      retriedAfter401: true,
    });
  }

  const body = await parseResponseBody(res);
  const data = assertSuccess<T>(body, res.status);
  return { success: true, data, meta: (body as ApiSuccess<T>).meta };
}
