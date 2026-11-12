"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { unsubscribeApi } from "../../api/unsubscribe/unsubscribe.api";

/**
 * The link from a marketing email. Nothing changes until the person presses the
 * button, so a mail scanner opening the link does not unsubscribe anyone.
 */
export function useUnsubscribePage() {
  const token = useSearchParams().get("token")?.trim() ?? "";
  const mutation = useMutation({
    mutationFn: () => unsubscribeApi.unsubscribe(token),
  });

  const handleConfirm = () => mutation.mutate();

  return {
    hasToken: token.length > 0,
    isPending: mutation.isPending,
    isDone: mutation.isSuccess,
    error: mutation.isError
      ? getApiErrorMessage(mutation.error, LABELS.unsubscribeFailed)
      : null,
    handleConfirm,
  };
}
