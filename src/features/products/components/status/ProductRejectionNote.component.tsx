import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productStatusNoteStyles as styles } from "../../styles/status/productStatusNote.styles";

interface ProductRejectionNoteProps {
  status?: string | null;
  note?: string | null;
}

/** Why the moderator rejected a listing, shown to the team that has to fix it. */
export function ProductRejectionNote({
  status,
  note,
}: ProductRejectionNoteProps) {
  if (status !== PRODUCT_STATUS.REJECTED || !note) return null;
  return (
    <p className={styles.rejection}>
      {formatLabel(LABELS.productRejectedBecause, { note })}
    </p>
  );
}
