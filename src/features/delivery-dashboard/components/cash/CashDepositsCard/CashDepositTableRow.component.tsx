import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { cashDepositsCardStyles } from "../../../styles/cash/cashDepositsCard.styles";
import type { CashDepositRowViewModel } from "../../../hooks/cash/useCashDepositsCardPresentation.hook";

interface CashDepositTableRowProps {
  row: CashDepositRowViewModel;
}

export function CashDepositTableRow({ row }: CashDepositTableRowProps) {
  return (
    <tr className={cashDepositsCardStyles.tr}>
      <td className={cashDepositsCardStyles.tdText}>{row.createdAtLabel}</td>
      <td className={cashDepositsCardStyles.tdMono}>{row.amountLabel}</td>
      <td className={cashDepositsCardStyles.tdExpected(row.mismatch)}>
        {row.expectedAmountLabel}
      </td>
      <td className={cashDepositsCardStyles.tdStatus}>
        <StatusBadge status={row.status} />
      </td>
      <td className={cashDepositsCardStyles.tdText}>{row.notesText}</td>
    </tr>
  );
}
