import type { DeliveryAgentDocument } from "@/features/delivery-dashboard";
import { agentDocumentsPanelStyles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";
import { AgentDocumentStatusBadge } from "./AgentDocumentStatusBadge.component";
import { AgentDocumentActionButtons } from "./AgentDocumentActionButtons.component";

interface AgentDocumentTableRowProps {
  doc: DeliveryAgentDocument;
  pendingId: string | null;
  onAct: (docId: string, action: "APPROVE" | "REJECT") => Promise<void>;
}

export function AgentDocumentTableRow({
  doc,
  pendingId,
  onAct,
}: AgentDocumentTableRowProps) {
  const isActionPending = pendingId === doc.id;
  const docTypeFormatted = doc.type.replace(/_/g, " ").toLowerCase();

  return (
    <tr className={agentDocumentsPanelStyles.tableRow}>
      <td className={agentDocumentsPanelStyles.tableCellMedium}>
        {doc.deliveryAgent?.fullName ?? "—"}
      </td>
      <td className={agentDocumentsPanelStyles.tableCellCapitalize}>
        {docTypeFormatted}
      </td>
      <td className={agentDocumentsPanelStyles.tableCell}>
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className={agentDocumentsPanelStyles.docLink}
        >
          View document
        </a>
      </td>
      <td className={agentDocumentsPanelStyles.tableCell}>
        <AgentDocumentStatusBadge
          verified={doc.verified}
          rejectedAt={doc.rejectedAt}
          rejectionReason={doc.rejectionReason}
        />
      </td>
      <td className={agentDocumentsPanelStyles.tableCellMuted}>
        {doc.expiryDate ?? "—"}
      </td>
      <td className={agentDocumentsPanelStyles.tableCell}>
        {!doc.verified ? (
          <AgentDocumentActionButtons
            documentId={doc.id}
            isPending={isActionPending}
            onAct={onAct}
          />
        ) : (
          <span className={agentDocumentsPanelStyles.tableCellMuted}>—</span>
        )}
      </td>
    </tr>
  );
}
