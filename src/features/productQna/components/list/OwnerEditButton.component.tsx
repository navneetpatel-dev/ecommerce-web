import { Pencil } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** Small "Edit" link-button shown only on the viewer's own post. */
export function OwnerEditButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={styles.ownerAction}
    >
      <Pencil className={styles.ownerActionIcon} aria-hidden />
      {LABELS.edit}
    </button>
  );
}
