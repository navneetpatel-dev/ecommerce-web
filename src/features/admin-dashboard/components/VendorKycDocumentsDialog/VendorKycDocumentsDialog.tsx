"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";
import { adminApi } from "../../api/admin.api";
import { KycChecklistItems } from "./KycChecklistItems";
import { KycConfirmDialogs } from "./KycConfirmDialogs";

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
