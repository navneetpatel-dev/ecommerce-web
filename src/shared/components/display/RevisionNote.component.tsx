import { Clock, Info } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import type { RevisionState } from "@/shared/utils/ugc/ugcRevision";
import { revisionNoteStyles as styles } from "../../styles/display/displayComponents.styles";

/**
 * One line under the author's own post: their edit is waiting (shoppers still
 * see the earlier version), or their last edit was declined.
 */
export function RevisionNote({ state }: { state: RevisionState }) {
  if (!state) return null;
  const pending = state === "pending";
  const Icon = pending ? Clock : Info;
  return (
    <p className={pending ? styles.pending : styles.declined}>
      <Icon className={styles.icon} aria-hidden />
      {pending ? LABELS.editAwaitingNote : LABELS.editDeclinedNote}
    </p>
  );
}
