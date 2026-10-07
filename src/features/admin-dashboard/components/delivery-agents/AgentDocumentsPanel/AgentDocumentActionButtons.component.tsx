import { useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { agentDocumentsPanelStyles } from "../../../styles/delivery-agents/agentDocumentsPanel.styles";

interface AgentDocumentActionButtonsProps {
  documentId: string;
  isPending: boolean;
  onApprove: (documentId: string) => void;
  onReject: (documentId: string) => void;
}

export function AgentDocumentActionButtons({
  documentId,
  isPending,
  onApprove,
  onReject,
}: AgentDocumentActionButtonsProps) {
  const handleApprove = useCallback(() => {
    onApprove(documentId);
  }, [documentId, onApprove]);

  const handleReject = useCallback(() => {
    onReject(documentId);
  }, [documentId, onReject]);

  return (
    <div className={agentDocumentsPanelStyles.actionsWrapper}>
      <Button
        size="sm"
        variant="outline"
        className={agentDocumentsPanelStyles.approveButton}
        loading={isPending}
        onClick={handleApprove}
      >
        <CheckCircle2
          className={agentDocumentsPanelStyles.actionIcon}
          aria-hidden="true"
        />
        {LABELS.approve}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className={agentDocumentsPanelStyles.rejectButton}
        loading={isPending}
        onClick={handleReject}
      >
        <XCircle
          className={agentDocumentsPanelStyles.actionIcon}
          aria-hidden="true"
        />
        {LABELS.reject}
      </Button>
    </div>
  );
}
