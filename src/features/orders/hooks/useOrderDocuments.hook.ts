import { useMutation } from "@tanstack/react-query";
import { reportsEngineApi } from "@/features/reports";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { Order } from "@/shared/api/types";

interface UseOrderDocumentsResult {
  downloadAllInvoices: () => void;
  downloadSubOrderInvoice: (subOrderId: string) => void;
  invoicePending: boolean;
  pendingSubOrderId: string | null;
  invoiceError: string | null;
}

/**
 * Owns order document downloads (per-vendor invoice + download-all ZIP)
 * for the order detail screen (Rule 1/12).
 */
export function useOrderDocuments(order: Order): UseOrderDocumentsResult {
  const allMutation = useMutation({
    mutationFn: () => reportsEngineApi.customerOrderInvoice(order.id),
  });
  const subMutation = useMutation({
    mutationFn: (subOrderId: string) =>
      reportsEngineApi.customerOrderSubInvoice(order.id, subOrderId),
  });

  const invoiceError = allMutation.isError
    ? getApiErrorMessage(allMutation.error, LABELS.genericActionFailed)
    : subMutation.isError
      ? getApiErrorMessage(subMutation.error, LABELS.genericActionFailed)
      : null;

  return {
    downloadAllInvoices: () => allMutation.mutate(),
    downloadSubOrderInvoice: (subOrderId: string) =>
      subMutation.mutate(subOrderId),
    invoicePending: allMutation.isPending || subMutation.isPending,
    pendingSubOrderId: subMutation.isPending
      ? ((subMutation.variables as string | undefined) ?? null)
      : null,
    invoiceError,
  };
}
