import { useCallback } from "react";
import { RotateCw, XCircle } from "lucide-react";
import { AgentMarkPayoutPaidAction } from "../AgentMarkPayoutPaidAction.component";
import { agentPayoutsPanelStyles } from "../../../styles/delivery-agents/agentPayoutsPanel.styles";

interface AgentPayoutActionsProps {
  payoutId: string;
  status: string;
  pendingId: string | null;
  onDone: () => void;
  onFail: (payoutId: string) => Promise<void>;
  onRetry: (payoutId: string) => Promise<void>;
}

export function AgentPayoutActions({
  payoutId,
  status,
  pendingId,
  onDone,
  onFail,
  onRetry,
}: AgentPayoutActionsProps) {
  const isPendingAction = pendingId === payoutId;

  const handleFail = useCallback(() => {
    void onFail(payoutId);
  }, [onFail, payoutId]);

  const handleRetry = useCallback(() => {
    void onRetry(payoutId);
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
          Mark failed
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
        Retry
      </button>
    );
  }

  return <span className={agentPayoutsPanelStyles.tableCellMuted}>—</span>;
}
