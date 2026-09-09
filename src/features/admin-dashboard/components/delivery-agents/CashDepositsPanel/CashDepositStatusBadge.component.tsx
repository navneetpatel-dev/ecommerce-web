import { cashDepositsPanelStyles } from "../../../styles/delivery-agents/cashDepositsPanel.styles";

interface CashDepositStatusBadgeProps {
  status: string;
}

export function CashDepositStatusBadge({
  status,
}: CashDepositStatusBadgeProps) {
  return (
    <span className={cashDepositsPanelStyles.statusBadge(status)}>
      {status}
    </span>
  );
}
