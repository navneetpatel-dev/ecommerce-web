"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { useVendorKycDocumentsDialog } from "../../hooks/useVendorKycDocumentsDialog.hook";
import { KycChecklistItems } from "./KycChecklistItems.component";
import { KycConfirmDialogs } from "./KycConfirmDialogs.component";

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
    setMode,
    activeItem,
    setActiveItem,
    reason,
    setReason,
    submitting,
    actionError,
    openingDocId,
    openDocument,
    closeConfirm,
    runVerify,
    runReject,
  } = useVendorKycDocumentsDialog(vendorId, open);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{LABELS.kycChecklist}</DialogTitle>
            <DialogDescription>
              {vendorName}
              {" · "}
              {isComplete
                ? LABELS.kycChecklistComplete
                : LABELS.kycChecklistIncomplete}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <p className="py-6 text-center text-body text-ink-muted">
              {LABELS.loading}
            </p>
          ) : null}

          {!loading && error ? (
            <p className="py-6 text-center text-body text-danger">{error}</p>
          ) : null}

          {actionError ? (
            <p className="text-center text-body-sm text-danger">
              {actionError}
            </p>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <p className="py-6 text-center text-body text-ink-muted">
              {LABELS.noKycDocuments}
            </p>
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <KycChecklistItems
              items={items}
              openingDocId={openingDocId}
              onOpenDocument={(documentId) => void openDocument(documentId)}
              onVerify={(item) => {
                setActiveItem(item);
                setMode("verify");
              }}
              onReject={(item) => {
                setActiveItem(item);
                setMode("reject");
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <KycConfirmDialogs
        mode={mode}
        activeItem={activeItem}
        vendorName={vendorName}
        submitting={submitting}
        reason={reason}
        onReasonChange={setReason}
        onClose={closeConfirm}
        onVerify={() => {
          void runVerify();
        }}
        onReject={() => {
          void runReject();
        }}
      />
    </>
  );
}
