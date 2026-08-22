import { useMutation } from "@tanstack/react-query";
import { reportsEngineApi } from "@/features/reports";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

interface UseOrderDocumentsResult {
  downloadInvoice: () => void;
  invoicePending: boolean;
  invoiceError: string | null;
}

/**
 * Owns order document downloads (invoice) for the order detail screen
 * (Rule 1/12: API calls live in hooks, not components).
 */
export function useOrderDocuments(orderId: string): UseOrderDocumentsResult {
  const invoiceMutation = useMutation({
    mutationFn: () => reportsEngineApi.customerOrderInvoice(orderId),
  });

  const downloadInvoice = () => {
    invoiceMutation.mutate();
  };

  return {
    downloadInvoice,
    invoicePending: invoiceMutation.isPending,
    invoiceError: invoiceMutation.isError
      ? getApiErrorMessage(invoiceMutation.error, LABELS.genericActionFailed)
      : null,
  };
}
