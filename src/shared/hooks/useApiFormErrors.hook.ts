"use client";

import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  applyApiErrorsToForm,
  getFormLevelApiError,
} from "@/shared/utils/applyApiFormErrors";

/**
 * Maps API validation errors onto react-hook-form fields and exposes a
 * form-level message only when no field errors were returned.
 */
export function useApiFormErrors<T extends FieldValues>(
  form: UseFormReturn<T>,
  apiError: unknown,
  fallback: string,
  fieldMap?: Partial<Record<string, keyof T & string>>,
) {
  useEffect(() => {
    if (!apiError) return;
    applyApiErrorsToForm(form, apiError, fieldMap);
  }, [apiError, form, fieldMap]);

  return {
    formLevelError: getFormLevelApiError(apiError, fallback),
  };
}
