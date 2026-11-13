import { Pencil, Trash2 } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { ownerActionsStyles as styles } from "../../styles/actions/ownerActions.styles";

interface OwnerActionsProps {
  /** Omitted when editing is not allowed (e.g. an answered question). */
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel: string;
  deleteLabel: string;
  /** Inside a metadata line (questions, answers). */
  compact?: boolean;
}

/** "Edit" and "Delete" on the viewer's own post: compact, quiet, same everywhere. */
export function OwnerActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
  compact = false,
}: OwnerActionsProps) {
  const action = cn(styles.action, compact && styles.compact);
  const icon = cn(styles.icon, compact && styles.compactIcon);

  return (
    <div className={styles.root}>
      {onEdit ? (
        <button
          type="button"
          aria-label={editLabel}
          onClick={onEdit}
          className={action}
        >
          <Pencil className={icon} aria-hidden />
          {LABELS.edit}
        </button>
      ) : null}
      {onDelete ? (
        <button
          type="button"
          aria-label={deleteLabel}
          onClick={onDelete}
          className={cn(action, styles.danger)}
        >
          <Trash2 className={icon} aria-hidden />
          {LABELS.deleteLabel}
        </button>
      ) : null}
    </div>
  );
}
