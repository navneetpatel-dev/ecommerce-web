"use client";

import { useEffect, useState } from "react";
import {
  deliveryAdminApi,
  type DeliveryAgentDocument,
} from "@/features/delivery-dashboard";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";

/** Owns the admin agent-KYC-documents review panel's data + approve/reject actions. */
export function useAgentDocumentsPanel() {
  const [documents, setDocuments] = useState<DeliveryAgentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const act = async (documentId: string, action: "APPROVE" | "REJECT") => {
    setError(null);
    setPendingId(documentId);
    try {
      const rejectionReason =
        action === "REJECT"
          ? (window.prompt("Reason for rejecting this document?") ?? "")
          : undefined;
      if (action === "REJECT" && !rejectionReason) {
        setPendingId(null);
        return;
      }
      await deliveryAdminApi.reviewDocument(
        documentId,
        action,
        rejectionReason,
      );
      load();
    } catch (actionError) {
      setError(
        getApiErrorMessage(actionError, "Could not update this document."),
      );
    } finally {
      setPendingId(null);
    }
  };

  const pendingReview = documents.filter(
    (doc) => !doc.verified && !doc.rejectedAt,
  );

  return { documents, loading, pendingId, error, act, pendingReview };
}
