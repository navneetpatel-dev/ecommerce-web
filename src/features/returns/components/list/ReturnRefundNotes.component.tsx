import { returnRequestCardStyles as styles } from "../../styles/list/returnRequestCard.styles";

interface ReturnRefundNotesProps {
  notes: string[];
}

export function ReturnRefundNotes({ notes }: ReturnRefundNotesProps) {
  if (notes.length === 0) return null;
  return (
    <>
      {notes.map((note) => (
        <p key={note} className={styles.refundMuted}>
          {note}
        </p>
      ))}
    </>
  );
}
