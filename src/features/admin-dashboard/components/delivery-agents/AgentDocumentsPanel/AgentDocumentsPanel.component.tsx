"use client";

import { LABELS } from "@/shared/constants/labels";

import { FileText } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/components/DataTable";
import type { DeliveryAgentDocument } from "@/features/delivery-dashboard";
import { useAgentDocumentsPanel } from "../../../hooks/delivery-agents/useAgentDocumentsPanel.hook";
import { agentDocumentsPanelStyles as styles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";
import { AgentDocumentStatusBadge } from "./AgentDocumentStatusBadge.component";
import { AgentDocumentActionButtons } from "./AgentDocumentActionButtons.component";
import { ReasonPromptDialog } from "@/shared/components/dialogs/ReasonPromptDialog.component";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

/** Admin review queue for delivery-agent KYC documents. */
export function AgentDocumentsPanel() {
  const {
    documents,
    loading,
    pendingId,
    error,
    approve,
    pendingReview,
    rejectReason,
  } = useAgentDocumentsPanel();

  const columns: DataTableColumn<DeliveryAgentDocument>[] = [
    {
      id: "agent",
      header: LABELS.agentName,
      className: styles.tableCellMedium,
      cell: (row) => row.deliveryAgent?.fullName ?? "—",
    },
    {
      id: "type",
      header: LABELS.documentTypeColumn,
      className: styles.tableCellCapitalize,
      cell: (row) => row.type.replace(/_/g, " ").toLowerCase(),
    },
    {
      id: "document",
      header: LABELS.documentColumn,
      truncate: false,
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className={styles.docLink}
        >
          {LABELS.viewDocument}
        </a>
      ),
    },
    {
      id: "status",
      header: LABELS.status,
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
      header: LABELS.expiryColumn,
      className: styles.tableCellMuted,
      cell: (row) => row.expiryDate ?? "—",
    },
  ];

  const renderActions = (row: DeliveryAgentDocument) =>
    row.verified ? null : (
      <AgentDocumentActionButtons
        documentId={row.id}
        isPending={pendingId === row.id}
        onApprove={approve}
        onReject={rejectReason.request}
      />
    );

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileText className={styles.headerIcon} aria-hidden="true" />
          <h2 className={styles.title}>{LABELS.agentDocsPanelTitle}</h2>
        </div>
        {pendingReview.length > 0 ? (
          <span className={styles.pendingBadge}>
            {formatLabel(LABELS.agentDocsPendingBadge, {
              count: pendingReview.length,
            })}
          </span>
        ) : null}
      </div>
      {error ? (
        <div role="alert" className={styles.errorAlert}>
          {error}
        </div>
      ) : null}
      <DataTable
        columns={columns}
        rows={documents}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={LABELS.noDocumentsEmpty}
        rowDetails={false}
        actions={renderActions}
      />
      <ReasonPromptDialog
        open={rejectReason.open}
        pending={rejectReason.pending}
        title={LABELS.rejectDocumentTitle}
        description={LABELS.rejectDocumentBody}
        placeholder={LABELS.rejectDocumentPlaceholder}
        confirmLabel={LABELS.reject}
        htmlFor="reject-document-reason"
        reason={rejectReason.reason}
        onReasonChange={rejectReason.onReasonChange}
        onOpenChange={rejectReason.onOpenChange}
        onSubmit={rejectReason.onSubmit}
      />
    </section>
  );
}
