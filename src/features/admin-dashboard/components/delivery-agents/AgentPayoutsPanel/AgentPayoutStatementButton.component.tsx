"use client";

import { useCallback } from "react";
import { Download } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { agentPayoutsPanelStyles as styles } from "../../../styles/delivery-agents/agentPayoutsPanel.styles";

interface AgentPayoutStatementButtonProps {
  payoutId: string;
  isDownloading: boolean;
  onDownload: (payoutId: string) => void;
}

/** Per-row commission-statement PDF download button. */
export function AgentPayoutStatementButton({
  payoutId,
  isDownloading,
  onDownload,
}: AgentPayoutStatementButtonProps) {
  const handleDownload = useCallback(() => {
    onDownload(payoutId);
  }, [onDownload, payoutId]);

  return (
    <button
      type="button"
      className={styles.pdfButton}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      <Download className={styles.actionIcon} aria-hidden="true" />
      {LABELS.pdfShortLabel}
    </button>
  );
}
