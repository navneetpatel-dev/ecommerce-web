import { ApiError } from "@/shared/types/apiError.types";
import { LABELS } from "@/shared/constants/labels";

/** Map API error codes to safe user-facing labels (never expose raw server text). */
const API_ERROR_LABEL_KEYS: Partial<Record<string, keyof typeof LABELS>> = {
  S3_ACCESS_DENIED: "uploadStorageUnavailable",
  S3_NOT_CONFIGURED: "uploadStorageUnavailable",
  UPLOAD_FAILED: "uploadFailed",
  UPLOAD_FORBIDDEN: "uploadForbidden",
  UPLOAD_TOO_LARGE: "uploadTooLargeGeneric",
  UPLOAD_INVALID_CONTENT_TYPE: "uploadInvalidImageType",
  UPLOAD_INVALID_PURPOSE: "uploadFailed",
  UPLOAD_INVALID_DATA_URL: "uploadFailed",
  INTERNAL_ERROR: "unexpectedError",
  CONFIG_ERROR: "unexpectedError",
  OAUTH_NOT_CONFIGURED: "oauthNotConfigured",
};

const INTERNAL_ERROR_PATTERNS = [
  /\b(?:backend|frontend|infra|src|node_modules)\//i,
  /\b(?:README|\.md|\.ts|\.tsx|\.json)\b/i,
  /\barn:aws:[a-z0-9-]*:[a-z0-9-]*:/i,
  /\bs3:[A-Z][a-zA-Z]+/,
  /\bAWS_[A-Z0-9_]+\b/,
  /\bIAM\b/i,
  /\bat\s+[\w./<>-]+\(\d+:\d+\)/,
  /AccessDenied/i,
  /not authorized to perform/i,
  /Configure\s+[A-Z_]+/,
  /See\s+\S+\/README/i,
];

/** Returns true when text looks like an internal/dev error and must not be shown to users. */
export function looksLikeInternalErrorMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return false;
  return INTERNAL_ERROR_PATTERNS.some((pattern) => pattern.test(trimmed));
}

/** Strip internal details; use fallback when the message is not safe to display. */
export function sanitizeUserFacingMessage(
  message: string | undefined | null,
  fallback: string,
): string {
  const trimmed = message?.trim();
  if (!trimmed) return fallback;
  if (looksLikeInternalErrorMessage(trimmed)) return fallback;
  return trimmed;
}

function labelForErrorCode(code: string | undefined): string | null {
  if (!code) return null;
  const key = API_ERROR_LABEL_KEYS[code];
  if (!key) return null;
  return LABELS[key];
}

function flattenFieldMap(
  fieldErrors: Record<string, string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (
      Array.isArray(messages) &&
      typeof messages[0] === "string" &&
      messages[0].trim()
    ) {
      out[key] = sanitizeUserFacingMessage(messages[0], messages[0]);
    }
  }
  return out;
}

/** Parse API validation details into `{ fieldName: message }` (Zod flatten or flat maps). */
export function parseApiFieldErrors(details: unknown): Record<string, string> {
  if (!details || typeof details !== "object") return {};

  const record = details as Record<string, unknown>;

  if (record.fieldErrors && typeof record.fieldErrors === "object") {
    return flattenFieldMap(
      record.fieldErrors as Record<string, string[] | undefined>,
    );
  }

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (key === "formErrors") continue;
    if (
      Array.isArray(value) &&
      typeof value[0] === "string" &&
      value[0].trim()
    ) {
      out[key] = sanitizeUserFacingMessage(value[0], value[0]);
    }
  }
  return out;
}

function firstFieldError(details: unknown): string | null {
  const parsed = parseApiFieldErrors(details);
  const first = Object.values(parsed)[0];
  if (first?.trim()) return first;

  if (!details || typeof details !== "object") return null;
  const formErrors = (details as { formErrors?: string[] }).formErrors;
  if (
    Array.isArray(formErrors) &&
    typeof formErrors[0] === "string" &&
    formErrors[0].trim()
  ) {
    return sanitizeUserFacingMessage(formErrors[0], "");
  }
  return null;
}

/** Prefer mapped labels and validation field errors; never leak internal infrastructure details. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const mapped = labelForErrorCode(err.code);
    if (mapped) return mapped;

    const fieldMessage = firstFieldError(err.details);
    if (fieldMessage) return fieldMessage || fallback;

    if (typeof err.details === "string" && err.details.trim()) {
      return sanitizeUserFacingMessage(err.details, fallback);
    }

    // Business validation (coupons, stock, etc.) uses VALIDATION_ERROR with a user-facing message.
    return sanitizeUserFacingMessage(err.message, fallback);
  }

  if (err instanceof Error) {
    return sanitizeUserFacingMessage(err.message, fallback);
  }

  return fallback;
}
