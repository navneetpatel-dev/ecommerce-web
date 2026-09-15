"use client";

import { useMemo, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import {
  commissionsApi,
  type CommissionInvoiceEntry,
} from "@/features/admin-dashboard";

export interface CommissionInvoiceViewModel {
  id: string;
  number: string;
  formattedDate: string;
  formattedAmount: string;
  isDownloading: boolean;
}

export function useCommissionInvoices(invoices: CommissionInvoiceEntry[]) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDownload = async (id: string) => {
    setPendingId(id);
    try {
      await commissionsApi.downloadInvoice(id);
    } catch (error) {
      notifyError(getApiErrorMessage(error, LABELS.downloadFailed));
    } finally {
      setPendingId(null);
    }
  };

  const invoiceViewModels = useMemo<CommissionInvoiceViewModel[]>(
    () =>
      invoices.map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        formattedDate: new Date(invoice.issuedAt).toLocaleDateString(),
        formattedAmount: formatInr(invoice.totalAmount),
        isDownloading: pendingId === invoice.id,
      })),
    [invoices, pendingId],
  );

  return {
    invoiceViewModels,
    handleDownload,
  };
}
