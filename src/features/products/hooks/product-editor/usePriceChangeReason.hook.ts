"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { ADMIN_NOTE_LIMITS } from "../../constants/listing-form/productFields";

/** The written reason for a price change: its text, its error, and the check before sending. */
export function usePriceChangeReason() {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | undefined>();

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(undefined);
  }, []);
  const clearError = useCallback(() => setError(undefined), []);
  const reset = useCallback(() => setValue(""), []);

  /** The reason to send, or null (with the error shown) when it is too short. */
  const take = (): string | null => {
    const text = value.trim();
    if (text.length >= ADMIN_NOTE_LIMITS.MIN) return text;
    setError(LABELS.priceChangeReasonRequired);
    return null;
  };

  return { value, error, onChange, clearError, reset, take };
}
