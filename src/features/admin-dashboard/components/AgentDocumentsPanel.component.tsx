"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, FileText, XCircle } from "lucide-react";
import {
  deliveryAdminApi,
  type DeliveryAgentDocument,
} from "@/features/delivery-dashboard";
import { Button } from "@/shared/components/ui/button";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";

/** Admin review queue for delivery-agent KYC documents. */
export function AgentDocumentsPanel() {
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

  return (
    <section className="space-y-3 border-b border-line pb-6">
      <div className="flex items-center gap-2">
        <FileText className="size-4 text-brand" aria-hidden="true" />
        <TextEyebrow className="!mb-0">
          Agent documents{" "}
          {pendingReview.length > 0 ? `(${pendingReview.length} pending)` : ""}
        </TextEyebrow>
      </div>
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-body-sm text-ink-muted">
          No documents submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2 pr-3 font-medium">Agent</th>
                <th className="py-2 pr-3 font-medium">Type</th>
                <th className="py-2 pr-3 font-medium">Document</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Expiry</th>
                <th className="py-2 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-line/60">
                  <td className="py-2 pr-3">
                    {doc.deliveryAgent?.fullName ?? "—"}
                  </td>
                  <td className="py-2 pr-3">{doc.type.replace(/_/g, " ")}</td>
                  <td className="py-2 pr-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-2 pr-3 text-ink-muted">
                    {doc.verified
                      ? "Approved"
                      : doc.rejectedAt
                        ? `Rejected: ${doc.rejectionReason ?? ""}`
                        : "Pending review"}
                  </td>
                  <td className="py-2 pr-3 text-ink-muted">
                    {doc.expiryDate ?? "—"}
                  </td>
                  <td className="py-2 pr-3">
                    {!doc.verified ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          loading={pendingId === doc.id}
                          onClick={() => void act(doc.id, "APPROVE")}
                        >
                          <CheckCircle2
                            className="size-3.5"
                            aria-hidden="true"
                          />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          loading={pendingId === doc.id}
                          onClick={() => void act(doc.id, "REJECT")}
                        >
                          <XCircle className="size-3.5" aria-hidden="true" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
