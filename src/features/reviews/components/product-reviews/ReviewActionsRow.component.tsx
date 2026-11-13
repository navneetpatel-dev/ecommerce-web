import { ThumbsDown, ThumbsUp } from "lucide-react";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Review } from "@/shared/api/types";
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

function helpfulSummary(count: number): string | null {
  if (!count) return null;
  return count === 1
    ? LABELS.helpfulByOne
    : formatLabel(LABELS.helpfulBy, { count: count.toLocaleString("en-IN") });
}

/**
 * Footer of a review: voting on the left ("Helpful? 👍 46 👎 2"), the author's
 * Edit / Delete on the right. Wraps to two lines on narrow screens.
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

  return (
    <div className={styles.actionsRow}>
      {isMine ? (
        <p className={styles.helpfulSummary}>{summary}</p>
      ) : (
        <div className={styles.helpfulGroup}>
          <span className={styles.voteLabel}>{LABELS.wasThisHelpful}</span>
          <button
            type="button"
            className={styles.voteChip}
            aria-label={formatLabel(LABELS.markHelpful, {
              count: review.helpfulCount,
            })}
            onClick={onVoteHelpful}
          >
            <ThumbsUp className={styles.voteIcon} aria-hidden />
            {review.helpfulCount}
          </button>
          <button
            type="button"
            className={styles.voteChip}
            aria-label={formatLabel(LABELS.markUnhelpful, {
              count: review.unhelpfulCount,
            })}
            onClick={onVoteUnhelpful}
          >
            <ThumbsDown className={styles.voteIcon} aria-hidden />
            {review.unhelpfulCount}
          </button>
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
