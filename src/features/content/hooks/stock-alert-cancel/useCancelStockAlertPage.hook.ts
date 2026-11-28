"use client";

import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { stockAlertsLabels } from "@/shared/constants/labels/stockAlerts";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { stockAlertsApi } from "@/features/stockAlerts";

/**
 * The cancel link from a stock alert email. Nothing changes until the person presses the
 * button, so a mail scanner opening the link cancels nothing.
 */
export function useCancelStockAlertPage() {
  const token = useSearchParams().get("token")?.trim() ?? "";
  const mutation = useMutation({
    mutationFn: () => stockAlertsApi.cancelByToken(token),
  });

  const handleConfirm = () => mutation.mutate();

  return {
    hasToken: token.length > 0,
    isPending: mutation.isPending,
    isDone: mutation.isSuccess,
    error: mutation.isError
      ? getApiErrorMessage(mutation.error, stockAlertsLabels.cancelFailed)
      : null,
    handleConfirm,
  };
}
