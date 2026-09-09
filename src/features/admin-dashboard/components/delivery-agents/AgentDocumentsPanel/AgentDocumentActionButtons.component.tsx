import { useCallback } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { agentDocumentsPanelStyles } from "./agentDocumentsPanel.styles";

interface AgentDocumentActionButtonsProps {
  documentId: string;
  isPending: boolean;
  onAct: (docId: string, action: "APPROVE" | "REJECT") => Promise<void>;
}

export function AgentDocumentActionButtons({
  documentId,
  isPending,
  onAct,
}: AgentDocumentActionButtonsProps) {
  const handleApprove = useCallback(() => {
    void onAct(documentId, "APPROVE");
  }, [documentId, onAct]);

  const handleReject = useCallback(() => {
    void onAct(documentId, "REJECT");
  }, [documentId, onAct]);

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
        Approve
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
        Reject
      </Button>
    </div>
  );
}
