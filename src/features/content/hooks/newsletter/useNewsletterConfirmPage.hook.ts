"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { newsletterApi } from "@/shared/api/newsletter.api";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

/**
 * The link from the "confirm your subscription" email. Nothing changes until the person
 * presses the button, so a mail scanner opening the link does not subscribe anyone.
 */
export function useNewsletterConfirmPage() {
  const token = useSearchParams().get("token")?.trim() ?? "";
  const mutation = useMutation({
    mutationFn: () => newsletterApi.confirm(token),
  });

  const handleConfirm = () => mutation.mutate();

  return {
    hasToken: token.length > 0,
    isPending: mutation.isPending,
    isDone: mutation.isSuccess,
    error: mutation.isError
      ? getApiErrorMessage(mutation.error, LABELS.newsletterConfirmFailed)
      : null,
    handleConfirm,
  };
}
