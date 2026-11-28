"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";

/** Runs one change to a variant at a time: which row is busy, then success or the error. */
export function useVariantAction(
  setError: (message: string | null) => void,
  afterSuccess: () => Promise<void>,
) {
  const [busyKey, setBusyKey] = useState<string | null>(null);

  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusyKey(key);
    setError(null);
    try {
      await action();
      notifySuccess(LABELS.variantSaved);
      await afterSuccess();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveVariant));
    } finally {
      setBusyKey(null);
    }
  };

  return { busyKey, run };
}
