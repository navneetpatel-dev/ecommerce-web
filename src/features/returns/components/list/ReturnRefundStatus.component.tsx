import { LABELS } from "@/shared/constants/labels";
import type { ReturnRequest } from "@/shared/api/types";
import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";
import {
  getReturnRefundStatusKind,
  returnInitiatedRefundDetail,
  returnPendingRefundDetail,
  returnRefundNotes,
} from "../../utils/list/returnRefundStatus";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { ReturnRefundNotes } from "./ReturnRefundNotes.component";

interface ReturnRefundStatusProps {
  row: ReturnRequest;
}

/**
 * Where the refund stands, with why it's smaller whatever its state: the offer the kept
 * items no longer qualify for, and cashback taken back from the wallet.
 */
export function ReturnRefundStatus({ row }: ReturnRefundStatusProps) {
  const kind = getReturnRefundStatusKind(row);
  const notes = <ReturnRefundNotes notes={returnRefundNotes(row)} />;

  if (kind === "completed") {
    return (
      <>
        <p>
          {LABELS.returnRefundStatusCompleted} {formatInr(row.refundAmount)}
        </p>
        {notes}
      </>
    );
  }

  if (kind === "initiated") {
    return (
      <>
        <p className={styles.refundMuted}>{returnInitiatedRefundDetail(row)}</p>
        {notes}
      </>
    );
  }

  if (kind === "failed") {
    return (
      <>
        <p className={styles.refundDanger}>{LABELS.returnRefundStatusFailed}</p>
        {notes}
      </>
    );
  }

  return (
    <>
      <p className={styles.refundMuted}>{returnPendingRefundDetail(row)}</p>
      {notes}
    </>
  );
}
