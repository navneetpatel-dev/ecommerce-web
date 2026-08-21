"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { StatusDialog } from "@/shared/components/StatusDialog";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { vendorDocumentTypeLabel } from "@/shared/utils/vendorDocumentTypeLabel";
import { vendorDocumentChecklistStatusLabel } from "@/shared/utils/vendorDocumentChecklistStatusLabel";
import { VENDOR_DOCUMENT_CHECKLIST_STATUS } from "@/shared/constants/statuses";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";
import { adminApi } from "../api/admin.api";

type ConfirmMode = "verify" | "reject" | null;

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
  const [items, setItems] = useState<KycChecklistItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConfirmMode>(null);
  const [activeItem, setActiveItem] = useState<KycChecklistItem | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const checklist = await vendorsApi.getKycChecklist(vendorId);
      setItems(checklist.items);
      setIsComplete(checklist.isComplete);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  const openDocument = async (documentId: string) => {
    setOpeningDocId(documentId);
    setActionError(null);
    try {
      const { url } = await vendorsApi.getDocumentViewUrl(documentId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotOpenDocument));
    } finally {
      setOpeningDocId(null);
    }
  };

  const closeConfirm = () => {
    if (submitting) return;
    setMode(null);
    setActiveItem(null);
    setReason("");
  };

  const runVerify = async () => {
    if (!activeItem?.documentId) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await adminApi.verifyVendorDocument(activeItem.documentId);
      closeConfirm();
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist));
    } finally {
      setSubmitting(false);
    }
  };

  const runReject = async () => {
    if (!activeItem?.documentId || !reason.trim()) return;
    setSubmitting(true);
    setActionError(null);
    try {
      await adminApi.rejectVendorDocument(activeItem.documentId, reason.trim());
      closeConfirm();
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist));
    } finally {
      setSubmitting(false);
    }
  };

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
            <p className="py-6 text-center text-[0.9375rem] text-ink-muted">
              {LABELS.loading}
            </p>
          ) : null}

          {!loading && error ? (
            <p className="py-6 text-center text-[0.9375rem] text-danger">
              {error}
            </p>
          ) : null}

          {actionError ? (
            <p className="text-center text-[0.8125rem] text-danger">
              {actionError}
            </p>
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <p className="py-6 text-center text-[0.9375rem] text-ink-muted">
              {LABELS.noKycDocuments}
            </p>
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <ul className="space-y-3">
              {items.map((item) => {
                const typeLabel = vendorDocumentTypeLabel(item.documentType);
                const canReview =
                  Boolean(item.documentId) &&
                  item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.VERIFIED &&
                  item.status !== VENDOR_DOCUMENT_CHECKLIST_STATUS.NOT_UPLOADED;
                return (
                  <li
                    key={item.documentType}
                    className="flex flex-col gap-3 rounded-md border border-line bg-surface px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="truncate text-[0.9375rem] font-medium text-ink">
                        {typeLabel}
                      </p>
                      <p className="text-[0.8125rem] text-ink-muted">
                        {vendorDocumentChecklistStatusLabel(item.status)}
                      </p>
                      {item.rejectionReason ? (
                        <p className="text-[0.75rem] text-danger">
                          {LABELS.documentRejectionReason}:{" "}
                          {item.rejectionReason}
                        </p>
                      ) : null}
                      {item.documentId ? (
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={() => void openDocument(item.documentId!)}
                          disabled={openingDocId === item.documentId}
                          className="h-auto min-h-0 max-h-none gap-1.5 px-0 py-0 text-[0.8125rem] font-medium text-brand"
                        >
                          <FileText className="size-3.5" aria-hidden />
                          {LABELS.openDocument}
                        </Button>
                      ) : null}
                    </div>
                    {canReview ? (
                      <div className="flex shrink-0 gap-2">
                        <Button
                          size="sm"
                          className="bg-brand text-paper hover:bg-brand-hover"
                          onClick={() => {
                            setActiveItem(item);
                            setMode("verify");
                          }}
                        >
                          {LABELS.verifyDocument}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveItem(item);
                            setMode("reject");
                          }}
                        >
                          {LABELS.rejectDocument}
                        </Button>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>

      <StatusDialog
        open={mode === "verify" && Boolean(activeItem)}
        onOpenChange={(next) => {
          if (!next) closeConfirm();
        }}
        variant="success"
        title={LABELS.confirmVerifyDocumentTitle}
        description={
          activeItem
            ? formatLabel(LABELS.confirmVerifyDocumentBody, {
                type: vendorDocumentTypeLabel(activeItem.documentType),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: closeConfirm,
        }}
        primaryAction={{
          label: LABELS.verifyDocument,
          loading: submitting,
          onClick: () => {
            void runVerify();
          },
        }}
      />

      <StatusDialog
        open={mode === "reject" && Boolean(activeItem)}
        onOpenChange={(next) => {
          if (!next) closeConfirm();
        }}
        variant="danger"
        title={LABELS.confirmRejectDocumentTitle}
        description={
          activeItem
            ? formatLabel(LABELS.confirmRejectDocumentBody, {
                type: vendorDocumentTypeLabel(activeItem.documentType),
                name: vendorName,
              })
            : undefined
        }
        secondaryAction={{
          label: LABELS.cancel,
          disabled: submitting,
          onClick: closeConfirm,
        }}
        primaryAction={{
          label: LABELS.rejectDocument,
          loading: submitting,
          disabled: !reason.trim(),
          onClick: () => {
            void runReject();
          },
        }}
      >
        <FormFieldFrame
          label={LABELS.documentRejectionReason}
          htmlFor="kyc-reject-reason"
        >
          <Textarea
            id="kyc-reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-24 resize-y"
          />
        </FormFieldFrame>
      </StatusDialog>
    </>
  );
}
