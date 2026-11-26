"use client";

import { useState } from "react";
import { productsApi } from "@/features/products";
import { ADMIN_NOTE_LIMITS } from "@/features/products";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";

interface Options {
  productId: string;
  onDone: () => void;
}

/** Records how the vendor agreed, then submits their platform-listed product for review. */
export function useSubmitOnBehalf({ productId, onDone }: Options) {
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const minLength = ADMIN_NOTE_LIMITS.MIN;
  const canSubmit = note.trim().length >= minLength && !submitting;

  const handleNoteChange = (value: string) => {
    setNote(value);
    setError(null);
  };

  const submit = async () => {
    if (note.trim().length < minLength) {
      setError(LABELS.consentNoteRequired);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await productsApi.submitOnBehalf(productId, note.trim());
      notifySuccess(LABELS.productSubmittedOnBehalf);
      onDone();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, LABELS.couldNotSaveProduct));
    } finally {
      setSubmitting(false);
    }
  };

  return { note, error, submitting, canSubmit, handleNoteChange, submit };
}
