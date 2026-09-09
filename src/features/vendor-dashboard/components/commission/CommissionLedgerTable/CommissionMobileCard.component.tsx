import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { commissionLedgerTableStyles } from "../../../styles/commission/commissionLedgerTable.styles";
import type { CommissionRowViewModel } from "../../../hooks/commission/useCommissionLedgerPresentation.hook";

interface CommissionMobileCardProps {
  row: CommissionRowViewModel;
}

export function CommissionMobileCard({ row }: CommissionMobileCardProps) {
  return (
    <li className={commissionLedgerTableStyles.mobileCard}>
      <div className={commissionLedgerTableStyles.mobileCardHeader}>
        <p className={commissionLedgerTableStyles.mobileCardDate}>
          {row.dateLabel}
        </p>
        <StatusBadge status={row.status} />
      </div>
      <dl className={commissionLedgerTableStyles.mobileGrid}>
        <div>
          <dt className={commissionLedgerTableStyles.mobileLabel}>Sale</dt>
          <dd className={commissionLedgerTableStyles.mobileValMono}>
            {row.saleAmountLabel}
          </dd>
        </div>
        <div>
          <dt className={commissionLedgerTableStyles.mobileLabel}>Rate</dt>
          <dd className={commissionLedgerTableStyles.mobileValText}>
            {row.rateLabel}
          </dd>
        </div>
        <div className={commissionLedgerTableStyles.mobileCommissionCol}>
          <dt className={commissionLedgerTableStyles.mobileLabel}>
            Commission
          </dt>
          <dd className={commissionLedgerTableStyles.mobileValMono}>
            {row.commissionAmountLabel}
          </dd>
        </div>
        <div>
          <dt className={commissionLedgerTableStyles.mobileLabel}>GST</dt>
          <dd className={commissionLedgerTableStyles.mobileValMono}>
            {row.gstAmountLabel}
          </dd>
        </div>
        <div>
          <dt className={commissionLedgerTableStyles.mobileLabel}>TDS</dt>
          <dd className={commissionLedgerTableStyles.mobileValMono}>
            {row.tdsAmountLabel}{" "}
            <span className={commissionLedgerTableStyles.mobileTdsRate}>
              ({row.tdsRateLabel})
            </span>
          </dd>
        </div>
      </dl>
    </li>
  );
}
