"use client";

import { CheckCircle2, FileText, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useAgentDocumentsPanel } from "../hooks/useAgentDocumentsPanel.hook";

/** Admin review queue for delivery-agent KYC documents. */
export function AgentDocumentsPanel() {
  const { documents, loading, pendingId, error, act, pendingReview } =
    useAgentDocumentsPanel();

  return (
    <section className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-4">
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2.5">
          <FileText className="size-5 text-brand" aria-hidden="true" />
          <h2 className="font-display text-[1.125rem] font-semibold text-ink">
            Agent verification documents (KYC)
          </h2>
        </div>
        {pendingReview.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-0.5 text-caption font-semibold text-warning">
            {pendingReview.length} pending review
          </span>
        ) : null}
      </div>
      {error ? (
        <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-body-sm font-medium text-danger">
          {error}
        </div>
      ) : null}
      {loading ? (
        <p className="text-body-sm text-ink-muted">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-ink-muted">
          No documents submitted yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-body-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-muted">
                <th className="py-2.5 pr-3 font-medium">Agent</th>
                <th className="py-2.5 pr-3 font-medium">Type</th>
                <th className="py-2.5 pr-3 font-medium">Document</th>
                <th className="py-2.5 pr-3 font-medium">Status</th>
                <th className="py-2.5 pr-3 font-medium">Expiry</th>
                <th className="py-2.5 pr-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-b border-line/60 hover:bg-paper/40 transition-colors"
                >
                  <td className="py-2.5 pr-3 font-medium">
                    {doc.deliveryAgent?.fullName ?? "—"}
                  </td>
                  <td className="py-2.5 pr-3 capitalize">
                    {doc.type.replace(/_/g, " ").toLowerCase()}
                  </td>
                  <td className="py-2.5 pr-3">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand hover:underline"
                    >
                      View document
                    </a>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-caption font-semibold ${
                        doc.verified
                          ? "bg-success/15 text-success"
                          : doc.rejectedAt
                            ? "bg-danger/15 text-danger"
                            : "bg-warning/15 text-warning"
                      }`}
                    >
                      {doc.verified
                        ? "Approved"
                        : doc.rejectedAt
                          ? `Rejected: ${doc.rejectionReason ?? ""}`
                          : "Pending review"}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-muted">
                    {doc.expiryDate ?? "—"}
                  </td>
                  <td className="py-2.5 pr-3">
                    {!doc.verified ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-success/40 text-success hover:bg-success hover:text-paper"
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
                          className="h-8 border-danger/40 text-danger hover:bg-danger hover:text-paper"
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
