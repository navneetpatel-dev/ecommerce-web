import { SUB_ORDER_CARD_STYLES } from "../../../styles/sub-order/subOrderCard.styles";

interface SubOrderRefundNoteProps {
  note: { text: string; failed: boolean } | null;
}

/** The card refund for a cancelled or undelivered part, with where it stands. */
export function SubOrderRefundNote({ note }: SubOrderRefundNoteProps) {
  if (!note) return null;
  return (
    <p
      className={
        note.failed
          ? SUB_ORDER_CARD_STYLES.refundNoteFailed
          : SUB_ORDER_CARD_STYLES.refundNote
      }
    >
      {note.text}
    </p>
  );
}
