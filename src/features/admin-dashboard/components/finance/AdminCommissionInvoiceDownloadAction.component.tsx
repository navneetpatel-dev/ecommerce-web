"use client";

import { Download } from "lucide-react";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import { useAdminCommissionInvoiceDownload } from "../../hooks/finance/useAdminCommissionInvoiceDownload.hook";

interface AdminCommissionInvoiceDownloadActionProps {
  invoiceId: string;
}

export function AdminCommissionInvoiceDownloadAction({
  invoiceId,
}: AdminCommissionInvoiceDownloadActionProps) {
  const { isDownloading, handleDownload } =
    useAdminCommissionInvoiceDownload(invoiceId);

  return (
    <RowActionButton
      icon={Download}
      label={LABELS.downloadCommissionInvoice}
      loading={isDownloading}
      onClick={handleDownload}
    />
  );
}
