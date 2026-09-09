import { agentDocumentsPanelStyles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";

interface AgentDocumentStatusBadgeProps {
  verified?: boolean;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
}

export function AgentDocumentStatusBadge({
  verified,
  rejectedAt,
  rejectionReason,
}: AgentDocumentStatusBadgeProps) {
  const isRejected = Boolean(rejectedAt);
  const label = verified
    ? "Approved"
    : isRejected
      ? `Rejected: ${rejectionReason ?? ""}`
      : "Pending review";

  return (
    <span
      className={agentDocumentsPanelStyles.statusBadge(verified, isRejected)}
    >
      {label}
    </span>
  );
}
