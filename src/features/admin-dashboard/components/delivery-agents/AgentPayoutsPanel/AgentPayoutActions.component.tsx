import { useCallback } from "react";
import { RotateCw, XCircle } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { AgentMarkPayoutPaidAction } from "../AgentMarkPayoutPaidAction.component";
import { agentPayoutsPanelStyles } from "../../../styles/delivery-agents/agentPayoutsPanel.styles";

interface AgentPayoutActionsProps {
  payoutId: string;
  status: string;
  pendingId: string | null;
  onDone: () => void;
  onRequestFail: (payoutId: string) => void;
  onRetry: (payoutId: string) => void;
}

export function AgentPayoutActions({
  payoutId,
  status,
  pendingId,
  onDone,
  onRequestFail,
  onRetry,
}: AgentPayoutActionsProps) {
  const isPendingAction = pendingId === payoutId;

  const handleFail = useCallback(() => {
    onRequestFail(payoutId);
  }, [onRequestFail, payoutId]);

  const handleRetry = useCallback(() => {
    onRetry(payoutId);
  }, [onRetry, payoutId]);

  if (status === "PENDING") {
    return (
      <div className={agentPayoutsPanelStyles.pendingActionsWrapper}>
        <AgentMarkPayoutPaidAction payoutId={payoutId} onDone={onDone} />
        <button
          type="button"
          className={agentPayoutsPanelStyles.failButton}
          disabled={isPendingAction}
          onClick={handleFail}
        >
          <XCircle
            className={agentPayoutsPanelStyles.actionIcon}
            aria-hidden="true"
          />
          {LABELS.markPayoutFailed}
        </button>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <button
        type="button"
        className={agentPayoutsPanelStyles.retryButton}
        disabled={isPendingAction}
        onClick={handleRetry}
      >
        <RotateCw
          className={agentPayoutsPanelStyles.actionIcon}
          aria-hidden="true"
        />
        {LABELS.retryPayout}
      </button>
    );
  }

  return <span className={agentPayoutsPanelStyles.tableCellMuted}>—</span>;
}
