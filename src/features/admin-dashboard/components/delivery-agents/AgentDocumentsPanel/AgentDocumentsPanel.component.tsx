"use client";

import { FileText } from "lucide-react";
import { useAgentDocumentsPanel } from "../../../hooks/delivery-agents/useAgentDocumentsPanel.hook";
import { agentDocumentsPanelStyles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";
import { AgentDocumentTableBody } from "./AgentDocumentTableBody.component";

/** Admin review queue for delivery-agent KYC documents. */
export function AgentDocumentsPanel() {
  const { documents, loading, pendingId, error, act, pendingReview } =
    useAgentDocumentsPanel();

  return (
    <section className={agentDocumentsPanelStyles.root}>
      <div className={agentDocumentsPanelStyles.header}>
        <div className={agentDocumentsPanelStyles.headerLeft}>
          <FileText
            className={agentDocumentsPanelStyles.headerIcon}
            aria-hidden="true"
          />
          <h2 className={agentDocumentsPanelStyles.title}>
            Agent verification documents (KYC)
          </h2>
        </div>
        {pendingReview.length > 0 ? (
          <span className={agentDocumentsPanelStyles.pendingBadge}>
            {pendingReview.length} pending review
          </span>
        ) : null}
      </div>
      {error ? (
        <div className={agentDocumentsPanelStyles.errorAlert}>{error}</div>
      ) : null}
      {loading ? (
        <p className={agentDocumentsPanelStyles.loadingText}>
          Loading documents...
        </p>
      ) : documents.length === 0 ? (
        <p className={agentDocumentsPanelStyles.emptyText}>
          No documents submitted yet.
        </p>
      ) : (
        <div className={agentDocumentsPanelStyles.tableWrapper}>
          <table className={agentDocumentsPanelStyles.table}>
            <thead>
              <tr className={agentDocumentsPanelStyles.tableHeaderRow}>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Agent
                </th>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Type
                </th>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Document
                </th>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Status
                </th>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Expiry
                </th>
                <th className={agentDocumentsPanelStyles.tableHeaderCell}>
                  Actions
                </th>
              </tr>
            </thead>
            <AgentDocumentTableBody
              documents={documents}
              pendingId={pendingId}
              onAct={act}
            />
          </table>
        </div>
      )}
    </section>
  );
}
