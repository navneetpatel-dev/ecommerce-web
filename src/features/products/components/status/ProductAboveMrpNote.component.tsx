import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productStatusNoteStyles as styles } from "../../styles/status/productStatusNote.styles";

interface ProductAboveMrpNoteProps {
  /** Every price is above the MRP. */
  all?: boolean;
  /** How many options are, when only some. */
  count?: number;
}

/** Tells the team which listings have stopped selling because they are priced above their MRP. */
export function ProductAboveMrpNote({
  all = false,
  count = 0,
}: ProductAboveMrpNoteProps) {
  if (!all && count === 0) return null;
  return (
    <p className={styles.rejection}>
      {all ? LABELS.aboveMrpAll : formatLabel(LABELS.aboveMrpSome, { count })}
    </p>
  );
}
