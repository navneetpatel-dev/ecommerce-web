"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { KycChecklistItems } from "./KycChecklistItems.component";
import { KycConfirmDialogs } from "./KycConfirmDialogs.component";
import { useVendorKycDialogHandlers } from "./useVendorKycDialogHandlers.hook";
import { vendorKycDocumentsDialogStyles as styles } from "./vendorKycDocumentsDialog.styles";

interface VendorKycDocumentsDialogProps {
  vendorId: string;
  vendorName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorKycDocumentsDialog({
  vendorId,
  vendorName,
  open,
  onOpenChange,
}: VendorKycDocumentsDialogProps) {
  const {
    items,
    isComplete,
    loading,
    error,
    mode,
    activeItem,
    reason,
    setReason,
    submitting,
    actionError,
    openingDocId,
    closeConfirm,
    runVerify,
    runReject,
    handleOpenDoc,
    handleVerify,
    handleReject,
  } = useVendorKycDialogHandlers(vendorId, open);

  const dialogSubtitle = `${vendorName} · ${
    isComplete ? LABELS.kycChecklistComplete : LABELS.kycChecklistIncomplete
  }`;

  const loadingText = loading ? (
    <p className={styles.loadingText}>{LABELS.loading}</p>
  ) : null;

  const errorText =
    !loading && error ? <p className={styles.errorText}>{error}</p> : null;

  const actionErrorText = actionError ? (
    <p className={styles.actionErrorText}>{actionError}</p>
  ) : null;

  const emptyText =
    !loading && !error && items.length === 0 ? (
      <p className={styles.emptyText}>{LABELS.noKycDocuments}</p>
    ) : null;

  const checklistContent =
    !loading && !error && items.length > 0 ? (
      <KycChecklistItems
        items={items}
        openingDocId={openingDocId}
        onOpenDocument={handleOpenDoc}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    ) : null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={styles.dialogContent}>
          <DialogHeader>
            <DialogTitle>{LABELS.kycChecklist}</DialogTitle>
            <DialogDescription>{dialogSubtitle}</DialogDescription>
          </DialogHeader>

          {loadingText}
          {errorText}
          {actionErrorText}
          {emptyText}
          {checklistContent}
        </DialogContent>
      </Dialog>

      <KycConfirmDialogs
        vendorName={vendorName}
        mode={mode}
        activeItem={activeItem}
        reason={reason}
        onReasonChange={setReason}
        submitting={submitting}
        onClose={closeConfirm}
        onVerify={runVerify}
        onReject={runReject}
      />
    </>
  );
}
