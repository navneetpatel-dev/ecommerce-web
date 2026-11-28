"use client";

import { TriangleAlert } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { useSubOrderReturnEstimate } from "../../../hooks/sub-order/useSubOrderReturnEstimate.hook";
import { SUB_ORDER_CARD_STYLES as styles } from "../../../styles/sub-order/subOrderCard.styles";

interface SubOrderReturnEstimateProps {
  orderItemId: string | null;
  returnQuantity: number;
  reasonCode: string;
  /** Only a refund has an amount to estimate. */
  enabled: boolean;
}

/** "Estimated refund ₹767.00", with a plain warning when an offer cuts it. */
export function SubOrderReturnEstimate({
  orderItemId,
  returnQuantity,
  reasonCode,
  enabled,
}: SubOrderReturnEstimateProps) {
  const { estimate, isLoading } = useSubOrderReturnEstimate(
    orderItemId,
    returnQuantity,
    reasonCode,
    enabled,
  );
  if (isLoading) {
    return (
      <p className={styles.returnEstimateMuted}>
        {LABELS.returnEstimateLoading}
      </p>
    );
  }
  if (!estimate) return null;
  return (
    <div role="status" className={styles.returnEstimate}>
      <p className={styles.returnEstimateAmount}>{estimate.refundLine}</p>
      {estimate.offerWarning ? (
        <p className={styles.returnEstimateWarning(estimate.nothingBack)}>
          <TriangleAlert aria-hidden className={styles.returnEstimateIcon} />
          {estimate.offerWarning}
        </p>
      ) : null}
      {estimate.cashbackNote ? (
        <p className={styles.returnEstimateMuted}>{estimate.cashbackNote}</p>
      ) : null}
      {estimate.feeNote ? (
        <p className={styles.returnEstimateMuted}>{estimate.feeNote}</p>
      ) : null}
    </div>
  );
}
