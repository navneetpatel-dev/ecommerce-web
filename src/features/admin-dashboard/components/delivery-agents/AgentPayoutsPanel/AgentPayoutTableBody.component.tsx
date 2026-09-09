import type { AgentPayout } from "@/features/delivery-dashboard";
import { AgentPayoutTableRow } from "./AgentPayoutTableRow.component";

interface AgentPayoutTableBodyProps {
  payouts: AgentPayout[];
  downloadingId: string | null;
  pendingId: string | null;
  onDone: () => void;
  onDownload: (payoutId: string) => Promise<void>;
  onFail: (payoutId: string) => Promise<void>;
  onRetry: (payoutId: string) => Promise<void>;
}

export function AgentPayoutTableBody({
  payouts,
  downloadingId,
  pendingId,
  onDone,
  onDownload,
  onFail,
  onRetry,
}: AgentPayoutTableBodyProps) {
  return (
    <tbody>
      {payouts.map((payout) => (
        <AgentPayoutTableRow
          key={payout.id}
          payout={payout}
          downloadingId={downloadingId}
          pendingId={pendingId}
          onDone={onDone}
          onDownload={onDownload}
          onFail={onFail}
          onRetry={onRetry}
        />
      ))}
    </tbody>
  );
}
