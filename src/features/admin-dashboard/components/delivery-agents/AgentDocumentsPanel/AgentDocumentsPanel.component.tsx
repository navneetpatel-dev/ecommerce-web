"use client";

import { FileText } from "lucide-react";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import type { DeliveryAgentDocument } from "@/features/delivery-dashboard";
import { useAgentDocumentsPanel } from "../../../hooks/delivery-agents/useAgentDocumentsPanel.hook";
import { agentDocumentsPanelStyles as styles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";
import { AgentDocumentStatusBadge } from "./AgentDocumentStatusBadge.component";
import { AgentDocumentActionButtons } from "./AgentDocumentActionButtons.component";

/** Admin review queue for delivery-agent KYC documents. */
export function AgentDocumentsPanel() {
  const { documents, loading, pendingId, error, act, pendingReview } =
    useAgentDocumentsPanel();

  const columns: DataTableColumn<DeliveryAgentDocument>[] = [
    {
      id: "agent",
      header: "Agent",
      className: styles.tableCellMedium,
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "type",
      header: "Type",
      className: styles.tableCellCapitalize,
      cell: (row) => row.type.replace(/_/g, " ").toLowerCase(),
    },
    {
      id: "document",
      header: "Document",
      truncate: false,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className={styles.docLink}
        >
          View document
        </a>
      ),
    },
    {
      id: "status",
      header: "Status",
      truncate: false,
      cell: (row) => (
        <AgentDocumentStatusBadge
          verified={row.verified}
          rejectedAt={row.rejectedAt}
          rejectionReason={row.rejectionReason}
        />
      ),
    },
    {
      id: "expiry",
      header: "Expiry",
      className: styles.tableCellMuted,
      cell: (row) => row.expiryDate ?? "—",
    },
  ];

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileText className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>Agent verification documents (KYC)</h2>
        </div>
        {pendingReview.length > 0 ? (
          <span className={styles.pendingBadge}>
            {pendingReview.length} pending review
          </span>
        ) : null}
      </div>
      {error ? <div className={styles.errorAlert}>{error}</div> : null}
      <DataTable
        columns={columns}
        rows={documents}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage="No documents submitted yet."
        rowDetails={false}
        actions={(row) =>
          row.verified ? null : (
            <AgentDocumentActionButtons
              documentId={row.id}
              isPending={pendingId === row.id}
              onAct={act}
            />
          )
        }
      />
    </section>
  );
}
