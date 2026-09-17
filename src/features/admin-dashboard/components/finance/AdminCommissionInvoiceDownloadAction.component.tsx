"use client";

import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { tableMenuButtonClass } from "@/shared/constants/table/tableActionTone";
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
    <Button
      type="button"
      variant="outline"
      size="sm"
      loading={isDownloading}
      className={tableMenuButtonClass("neutral")}
      onClick={handleDownload}
    >
      <Download strokeWidth={2.25} aria-hidden />
      <span>{LABELS.downloadCommissionInvoice}</span>
    </Button>
  );
}
