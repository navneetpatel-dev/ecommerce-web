import type { LucideIcon } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";

interface ReviewVoteChipProps {
  icon: LucideIcon;
  count: number;
  /** "Mark as helpful ({count})" / "Mark as not helpful ({count})". */
  labelTemplate: string;
  /** This is the vote the viewer gave: lit up, and a second click takes it back. */
  active: boolean;
  onClick: () => void;
}

/** One Helpful / Not helpful toggle with its count. */
export function ReviewVoteChip({
  icon: Icon,
  count,
  labelTemplate,
  active,
  onClick,
}: ReviewVoteChipProps) {
  return (
    <button
      type="button"
      className={active ? styles.voteChipActive : styles.voteChip}
      aria-label={formatLabel(labelTemplate, { count })}
      aria-pressed={active}
      title={active ? LABELS.removeYourVote : undefined}
      onClick={onClick}
    >
      <Icon
        className={active ? styles.voteIconActive : styles.voteIcon}
        aria-hidden
      />
      {count.toLocaleString("en-IN")}
    </button>
  );
}
