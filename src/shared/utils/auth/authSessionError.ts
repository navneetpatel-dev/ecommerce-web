import { ERROR_CODES } from "@/shared/constants/http/errors";
import { ApiError } from "@/shared/types/apiError.types";

const DEFINITIVE_AUTH_FAILURE_CODES = new Set<string>([
  ERROR_CODES.UNAUTHORIZED,
  ERROR_CODES.TOKEN_EXPIRED,
  ERROR_CODES.REFRESH_TOKEN_EXPIRED,
  ERROR_CODES.INVALID_REFRESH_TOKEN,
  ERROR_CODES.REFRESH_REQUIRED,
]);

export function isDefinitiveAuthFailure(err: unknown): boolean {
  if (!(err instanceof ApiError)) return false;
  return DEFINITIVE_AUTH_FAILURE_CODES.has(err.code);
}

export function isTransientNetworkError(err: unknown): boolean {
  if (!(err instanceof Error)) return true;
  if (err.name === "TimeoutError" || err.name === "AbortError") return true;
  const message = err.message.toLowerCase();
  return (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("timed out")
  );
}

export function isDefinitiveAuthErrorCode(code: string | undefined): boolean {
  return Boolean(code && DEFINITIVE_AUTH_FAILURE_CODES.has(code));
}
