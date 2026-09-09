import { ApiError } from "@/shared/types/apiError.types";
import { ERROR_CODES, ERROR_MESSAGES } from "@/shared/constants/errors";
import { LABELS } from "@/shared/constants/labels";
import {
  API_ERROR_LABEL_KEYS,
  INTERNAL_ERROR_PATTERNS,
} from "./apiErrorMessageData";

type ApiFailureBody = {
  success: false;
  error: { code?: string; message?: string; details?: unknown };
};

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

/** Build ApiError from a failed API JSON envelope (blob/download fetch paths). */
export function apiErrorFromFailureBody(
  body: unknown,
  status: number,
): ApiError {
  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    !(body as ApiFailureBody).success
  ) {
    const failure = body as ApiFailureBody;
    return new ApiError(
      failure.error?.code ?? ERROR_CODES.REQUEST_FAILED,
      failure.error?.message ?? `Request failed (${status})`,
      failure.error?.details,
    );
  }
  if (status === 429) {
    return new ApiError(ERROR_CODES.RATE_LIMITED, ERROR_MESSAGES.RATE_LIMITED);
  }
  return new ApiError(ERROR_CODES.REQUEST_FAILED, `Request failed (${status})`);
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
