import { useCallback } from "react";
import { Download } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import type { AgentPayout } from "@/features/delivery-dashboard";
import { agentPayoutsPanelStyles } from "./agentPayoutsPanel.styles";
import { AgentPayoutActions } from "./AgentPayoutActions.component";

interface AgentPayoutTableRowProps {
  payout: AgentPayout;
  downloadingId: string | null;
  pendingId: string | null;
  onDone: () => void;
  onDownload: (payoutId: string) => Promise<void>;
  onFail: (payoutId: string) => Promise<void>;
  onRetry: (payoutId: string) => Promise<void>;
}

export function AgentPayoutTableRow({
  payout,
  downloadingId,
  pendingId,
  onDone,
  onDownload,
  onFail,
  onRetry,
}: AgentPayoutTableRowProps) {
  const isDownloading = downloadingId === payout.id;

  const handleDownload = useCallback(() => {
    void onDownload(payout.id);
  }, [onDownload, payout.id]);

  const periodString = `${new Date(payout.periodStart).toLocaleDateString()} – ${new Date(payout.periodEnd).toLocaleDateString()}`;

  const referenceOrReason =
    payout.status === "FAILED"
      ? payout.failureReason
      : (payout.paymentReferenceNumber ?? "—");

  return (
    <tr className={agentPayoutsPanelStyles.tableRow}>
      <td className={agentPayoutsPanelStyles.tableCellMedium}>
        {payout.agentName ?? "—"}
      </td>
      <td className={agentPayoutsPanelStyles.tableCellMuted}>{periodString}</td>
      <td className={agentPayoutsPanelStyles.tableCellAmount}>
        ₹{payout.amount.toFixed(2)}
      </td>
      <td className={agentPayoutsPanelStyles.tableCell}>
        <StatusBadge status={payout.status} />
      </td>
      <td className={agentPayoutsPanelStyles.tableCellMuted}>
        {referenceOrReason}
      </td>
      <td className={agentPayoutsPanelStyles.tableCell}>
        <button
          type="button"
          className={agentPayoutsPanelStyles.pdfButton}
          disabled={isDownloading}
          onClick={handleDownload}
        >
          <Download
            className={agentPayoutsPanelStyles.actionIcon}
            aria-hidden="true"
          />
          PDF
        </button>
      </td>
      <td className={agentPayoutsPanelStyles.tableCell}>
        <AgentPayoutActions
          payoutId={payout.id}
          status={payout.status}
          pendingId={pendingId}
          onDone={onDone}
          onFail={onFail}
          onRetry={onRetry}
        />
      </td>
    </tr>
  );
}
