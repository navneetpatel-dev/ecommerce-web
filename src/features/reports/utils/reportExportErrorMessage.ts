import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

function isExportTimeoutError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  return err.name === "TimeoutError" || err.name === "AbortError";
}

/** User-facing export errors — maps 429 pending cap to a specific label. */
export function getReportExportErrorMessage(
  err: unknown,
  fallback: string = LABELS.reportLoadError,
): string {
  if (isExportTimeoutError(err)) {
    return LABELS.reportAsyncTimeout;
  }
  if (err instanceof ApiError && err.code === ERROR_CODES.RATE_LIMITED) {
    return LABELS.reportExportTooManyPending;
  }
  return getApiErrorMessage(err, fallback);
}
