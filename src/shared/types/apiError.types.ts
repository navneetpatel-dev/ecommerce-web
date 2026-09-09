import { ERROR_CODES } from "@/shared/constants/http/errors";

/**
 * Typed error shape produced by the API layer before it reaches hooks or
 * components (Rule 20). Callers branch on `code`, never on raw HTTP status
 * codes or provider-specific payloads.
 */
export class ApiError extends Error {
  code: string;
  details?: unknown;

  constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = "ApiError";
  }
}

/** Narrow an unknown caught value into a typed ApiError. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  return new ApiError(ERROR_CODES.REQUEST_FAILED, String(error));
}

/** True when a caught value is an ApiError carrying this specific code. */
export function isApiErrorCode(error: unknown, code: string): boolean {
  return error instanceof ApiError && error.code === code;
}
