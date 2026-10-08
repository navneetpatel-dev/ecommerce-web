"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { vendorsApi, type KycChecklistItem } from "@/features/vendors";

export type VendorKycConfirmMode = "verify" | "reject" | null;

/** Owns the admin vendor-KYC-review dialog's checklist data + verify/reject actions. */
export function useVendorKycDocumentsDialog(vendorId: string, open: boolean) {
  const [items, setItems] = useState<KycChecklistItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<VendorKycConfirmMode>(null);
  const [activeItem, setActiveItem] = useState<KycChecklistItem | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);

  const load = useCallback(() => {
    return vendorsApi
      .getKycChecklist(vendorId)
      .then((checklist) => {
        setError(null);
        setItems(checklist.items);
        setIsComplete(checklist.isComplete);
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist));
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [vendorId]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  // Re-arm the spinner while the dialog is closed so the next open starts
  // fresh (during render — keeps `load` free of synchronous setState).
  const [syncedOpen, setSyncedOpen] = useState(open);
  if (open !== syncedOpen) {
    setSyncedOpen(open);
    if (!open) {
      setLoading(true);
      setError(null);
    }
  }

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
      await vendorsApi.verifyDocument(activeItem.documentId);
      closeConfirm();
      setLoading(true);
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
      await vendorsApi.rejectDocument(activeItem.documentId, reason.trim());
      closeConfirm();
      setLoading(true);
      await load();
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadKycChecklist));
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
  };
}
