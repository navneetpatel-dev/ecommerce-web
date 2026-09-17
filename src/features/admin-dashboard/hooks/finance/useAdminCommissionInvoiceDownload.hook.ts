"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { commissionsApi } from "../../api/finance/finance.api";

export function useAdminCommissionInvoiceDownload(invoiceId: string) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await commissionsApi.downloadInvoice(invoiceId);
    } catch (error) {
      notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
    } finally {
      setIsDownloading(false);
    }
  }, [invoiceId]);

  return {
    isDownloading,
    handleDownload,
  };
}
