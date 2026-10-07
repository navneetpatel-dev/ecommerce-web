"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type DeliveryAgentDocument,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useReasonPrompt } from "@/shared/hooks/dialogs/useReasonPrompt.hook";

/** Owns the admin agent-KYC-documents review panel's data + approve/reject actions. */
export function useAgentDocumentsPanel() {
  const [documents, setDocuments] = useState<DeliveryAgentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rejectPrompt = useReasonPrompt();

  function fetchDocuments() {
    return deliveryAdminApi
      .documents()
      .then(setDocuments)
      .catch(() => setDocuments([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  const load = () => {
    setLoading(true);
    fetchDocuments();
  };

  const approve = async (documentId: string) => {
    setError(null);
    setPendingId(documentId);
    try {
      await deliveryAdminApi.reviewDocument(documentId, "APPROVE");
      load();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError, LABELS.couldNotUpdateDocument));
    } finally {
      setPendingId(null);
    }
  };

  const runReject = async (documentId: string, reason: string) => {
    setPendingId(documentId);
    try {
      await deliveryAdminApi.reviewDocument(documentId, "REJECT", reason);
      rejectPrompt.cancel();
      load();
    } catch (actionError) {
      setError(getApiErrorMessage(actionError, LABELS.couldNotUpdateDocument));
    } finally {
      setPendingId(null);
    }
  };

  const confirmReject = () => {
    const documentId = rejectPrompt.targetId;
    const reason = rejectPrompt.reason.trim();
    if (!documentId || !reason) return;
    setError(null);
    void runReject(documentId, reason);
  };

  const pendingReview = documents.filter(
    (doc) => !doc.verified && !doc.rejectedAt,
  );

  return {
    documents,
    loading,
    pendingId,
    error,
    approve,
    pendingReview,
    rejectReason: {
      open: rejectPrompt.open,
      pending: pendingId === rejectPrompt.targetId,
      reason: rejectPrompt.reason,
      onOpenChange: rejectPrompt.handleOpenChange,
      onReasonChange: rejectPrompt.handleReasonChange,
      onSubmit: confirmReject,
      request: rejectPrompt.openFor,
    },
  };
}
