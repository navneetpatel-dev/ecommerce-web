import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Review } from "@/shared/api/types";
import { ReviewVoteChip } from "./ReviewVoteChip.component";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";

interface ReviewActionsRowProps {
  review: Review;
  /** The viewer wrote it: no voting on your own review; Edit / Delete instead. */
  isMine: boolean;
  onVoteHelpful: () => void;
  onVoteUnhelpful: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

/** Says, in words, which vote the viewer gave (the lit chip alone is easy to miss). */
const VOTE_NOTES = {
  HELPFUL: LABELS.youFoundHelpful,
  UNHELPFUL: LABELS.youFoundUnhelpful,
  NONE: null,
} as const;

function helpfulSummary(count: number): string | null {
  if (!count) return null;
  return count === 1
    ? LABELS.helpfulByOne
    : formatLabel(LABELS.helpfulBy, { count: count.toLocaleString("en-IN") });
}

/**
 * Footer of a review: voting on the left ("Helpful? 👍 46 👎 2"), the author's
 * Edit / Delete on the right. The viewer's own vote is lit and named ("You
 * found this helpful"); clicking it again takes it back. Wraps on narrow screens.
 */
export function ReviewActionsRow({
  review,
  isMine,
  onVoteHelpful,
  onVoteUnhelpful,
  onEdit,
  onDelete,
}: ReviewActionsRowProps) {
  const summary = helpfulSummary(review.helpfulCount);
  const voteNote = VOTE_NOTES[review.myVote ?? "NONE"];

  return (
    <div className={styles.actionsRow}>
      {isMine ? (
        <p className={styles.helpfulSummary}>{summary}</p>
      ) : (
        <div className={styles.helpfulGroup}>
          <span className={styles.voteLabel}>{LABELS.wasThisHelpful}</span>
          <ReviewVoteChip
            icon={ThumbsUp}
            count={review.helpfulCount}
            labelTemplate={LABELS.markHelpful}
            active={review.myVote === "HELPFUL"}
            onClick={onVoteHelpful}
          />
          <ReviewVoteChip
            icon={ThumbsDown}
            count={review.unhelpfulCount}
            labelTemplate={LABELS.markUnhelpful}
            active={review.myVote === "UNHELPFUL"}
            onClick={onVoteUnhelpful}
          />
          {voteNote ? (
            <span className={styles.voteNote}>
              <Check className={styles.voteNoteIcon} aria-hidden />
              {voteNote}
            </span>
          ) : null}
        </div>
      )}
      {isMine ? (
        <OwnerActions
          onEdit={onEdit}
          onDelete={onDelete}
          editLabel={LABELS.editReviewAria}
          deleteLabel={LABELS.deleteReviewAria}
        />
      ) : null}
    </div>
  );
}
