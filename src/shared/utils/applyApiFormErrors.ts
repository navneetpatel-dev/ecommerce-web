import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { ApiError } from "@/shared/types/apiError.types";
import {
  getApiErrorMessage,
  parseApiFieldErrors,
} from "@/shared/utils/apiErrorMessage";

/** Apply server field errors onto a react-hook-form instance. Returns true when any field was set. */
export function applyApiErrorsToForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: unknown,
  fieldMap?: Partial<Record<string, Path<T>>>,
): boolean {
  if (!(error instanceof ApiError)) return false;

  const parsed = parseApiFieldErrors(error.details);
  const entries = Object.entries(parsed);
  if (!entries.length) return false;

  for (const [apiKey, message] of entries) {
    const formKey = (fieldMap?.[apiKey] ?? apiKey) as Path<T>;
    form.setError(formKey, { type: "server", message });
  }

  return true;
}

/** Form-level message when API error is not mapped to specific fields. */
export function getFormLevelApiError(
  error: unknown,
  fallback: string,
): string | null {
  if (!error) return null;
  if (error instanceof ApiError) {
    const parsed = parseApiFieldErrors(error.details);
    if (Object.keys(parsed).length > 0) return null;
  }
  return getApiErrorMessage(error, fallback);
}

/** Apply server field errors onto manual (non-RHF) forms. */
export function applyApiErrorsToManualForm<T extends string>(
  error: unknown,
  setErrors: (errors: Partial<Record<T, string>>) => void,
  fieldMap?: Partial<Record<string, T>>,
): boolean {
  if (!(error instanceof ApiError)) return false;

  const parsed = parseApiFieldErrors(error.details);
  const entries = Object.entries(parsed);
  if (!entries.length) return false;

  const next: Partial<Record<T, string>> = {};
  for (const [apiKey, message] of entries) {
    const fieldKey = (fieldMap?.[apiKey] ?? apiKey) as T;
    next[fieldKey] = message;
  }
  setErrors(next);
  return true;
}
