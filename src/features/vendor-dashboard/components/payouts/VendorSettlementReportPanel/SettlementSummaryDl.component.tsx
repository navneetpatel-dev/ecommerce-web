import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { VendorReportSummary } from "@/features/admin-dashboard";
import {
  SETTLEMENT_SUMMARY_DD,
  SETTLEMENT_SUMMARY_DL,
  SETTLEMENT_SUMMARY_DT,
} from "../../../styles/payouts/vendorSettlementReportPanel.styles";

interface SettlementSummaryDlProps {
  summary: VendorReportSummary;
}

export function SettlementSummaryDl({ summary }: SettlementSummaryDlProps) {
  return (
    <dl className={SETTLEMENT_SUMMARY_DL}>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.grossSales}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>{formatInr(summary.sales)}</dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.commissionCharged}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.commissionDeducted)}
        </dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.tcsCollected}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.tcsDeducted)}
        </dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.ownCouponDiscounts}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.discountAbsorbed.ownCoupons)}
        </dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>
          {LABELS.platformCouponDiscounts}
        </dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.discountAbsorbed.platformCouponsOnMyItems)}
        </dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.upcomingPayout}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.upcomingPayout)}
        </dd>
      </div>
      <div>
        <dt className={SETTLEMENT_SUMMARY_DT}>{LABELS.historicalPayout}</dt>
        <dd className={SETTLEMENT_SUMMARY_DD}>
          {formatInr(summary.historicalPayout)}
        </dd>
      </div>
    </dl>
  );
}
