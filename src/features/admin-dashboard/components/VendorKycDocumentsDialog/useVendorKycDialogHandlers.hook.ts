"use client";

import type { KycChecklistItem } from "@/features/vendors";
import { useVendorKycDocumentsDialog } from "../../hooks/useVendorKycDocumentsDialog.hook";

export function useVendorKycDialogHandlers(vendorId: string, open: boolean) {
  const dialogState = useVendorKycDocumentsDialog(vendorId, open);

  const handleOpenDoc = (documentId: string) => {
    void dialogState.openDocument(documentId);
  };

  const handleVerify = (item: KycChecklistItem) => {
    dialogState.setActiveItem(item);
    dialogState.setMode("verify");
  };

  const handleReject = (item: KycChecklistItem) => {
    dialogState.setActiveItem(item);
    dialogState.setMode("reject");
  };

  return {
    ...dialogState,
    handleOpenDoc,
    handleVerify,
    handleReject,
  };
}
