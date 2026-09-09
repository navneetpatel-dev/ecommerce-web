import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { ReturnRequest } from "@/shared/api/types";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";
import {
  getReturnRefundStatusKind,
  returnInitiatedRefundDetail,
} from "../../utils/list/returnRefundStatus";

interface ReturnRefundStatusProps {
  row: ReturnRequest;
}

export function ReturnRefundStatus({ row }: ReturnRefundStatusProps) {
  const kind = getReturnRefundStatusKind(row);

  if (kind === "completed") {
    return (
      <p>
        {LABELS.returnRefundStatusCompleted} {formatInr(row.refundAmount ?? 0)}
      </p>
    );
  }

  if (kind === "initiated") {
    return (
      <p className={styles.refundMuted}>{returnInitiatedRefundDetail(row)}</p>
    );
  }

  if (kind === "failed") {
    return (
      <p className={styles.refundDanger}>{LABELS.returnRefundStatusFailed}</p>
    );
  }

  return (
    <p className={styles.refundMuted}>{LABELS.returnRefundStatusPending}</p>
  );
}
