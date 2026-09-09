import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { payoutsTableStyles } from "./payoutsTable.styles";
import type { PayoutRowViewModel } from "./usePayoutsTablePresentation.hook";

interface PayoutMobileCardProps {
  row: PayoutRowViewModel;
}

export function PayoutMobileCard({ row }: PayoutMobileCardProps) {
  return (
    <li className={payoutsTableStyles.mobileCard}>
      <div className={payoutsTableStyles.mobileCardHeader}>
        <p className={payoutsTableStyles.mobileCardPeriod}>{row.periodLabel}</p>
        <StatusBadge status={row.status} />
      </div>
      <p className={payoutsTableStyles.mobileCardAmount}>{row.amountLabel}</p>
      <p className={payoutsTableStyles.mobileCardDetails}>{row.detailsLabel}</p>
    </li>
  );
}
