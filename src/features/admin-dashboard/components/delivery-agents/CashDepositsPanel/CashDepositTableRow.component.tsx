import type { CashDeposit } from "@/features/delivery-dashboard";
import { cashDepositsPanelStyles } from "../../../styles/delivery-agents/cashDepositsPanel.styles";
import { CashDepositStatusBadge } from "./CashDepositStatusBadge.component";
import { CashDepositActionButtons } from "./CashDepositActionButtons.component";
import { formatInrExact } from "@/shared/utils/formatting/orderFormat";

interface CashDepositTableRowProps {
  deposit: CashDeposit;
  pendingId: string | null;
  onAct: (depositId: string, action: "VERIFY" | "REJECT") => Promise<void>;
}

export function CashDepositTableRow({
  deposit,
  pendingId,
  onAct,
}: CashDepositTableRowProps) {
  const isActionPending = pendingId === deposit.id;

  const noteText =
    deposit.status === "REJECTED"
      ? deposit.rejectionReason
      : (deposit.note ?? "—");

  return (
    <tr className={cashDepositsPanelStyles.tableRow}>
      <td className={cashDepositsPanelStyles.tableCell}>
        {deposit.deliveryAgent?.fullName ?? "—"}
      </td>
      <td className={cashDepositsPanelStyles.tableCellMono}>
        {formatInrExact(deposit.amount)}
      </td>
      <td
        className={cashDepositsPanelStyles.expectedCell(deposit.hasDiscrepancy)}
      >
        {formatInrExact(deposit.expectedAmount)}
      </td>
      <td className={cashDepositsPanelStyles.tableCell}>
        <CashDepositStatusBadge status={deposit.status} />
      </td>
      <td className={cashDepositsPanelStyles.tableCellMuted}>{noteText}</td>
      <td className={cashDepositsPanelStyles.tableCell}>
        {deposit.status === "PENDING" ? (
          <CashDepositActionButtons
            depositId={deposit.id}
            isPending={isActionPending}
            onAct={onAct}
          />
        ) : (
          <span className={cashDepositsPanelStyles.tableCellMuted}>—</span>
        )}
      </td>
    </tr>
  );
}
