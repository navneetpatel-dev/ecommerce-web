import { getApiSessionAdapter } from "@/shared/api/client/sessionAdapter";
import { API } from "@/shared/constants/apiRoutes";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/http/errors";
import { REFRESH_TIMEOUT_MS } from "@/shared/constants/timing/timing";
import { CLIENT_API_BASE_URL } from "@/shared/config/appConfig";
import { ApiError } from "@/shared/types/apiError.types";
import {
  isDefinitiveAuthErrorCode,
  isTransientNetworkError,
} from "@/shared/utils/auth/authSessionError";
import { parseResponseBody, type ApiFailure } from "./envelope";

const BASE_URL = CLIENT_API_BASE_URL;

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
      const accessToken = (body.data as { accessToken: string }).accessToken;
      const adapter = getApiSessionAdapter();
      if (
        adapter.acceptRefreshedToken &&
        !adapter.acceptRefreshedToken(accessToken)
      ) {
        return "auth_failure";
      }
      persistAccessToken(accessToken);
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
export async function refreshSessionOrThrow(): Promise<void> {
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
