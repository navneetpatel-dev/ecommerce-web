"use client";

import { BadgeCheck, Store } from "lucide-react";
import { RatingStars } from "@/shared/components/display/RatingStars.component";
import { LABELS } from "@/shared/constants/labels";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Review } from "@/shared/api/types";
import {
  reviewerInitials,
  reviewStatusText,
} from "../../utils/productReviews.utils";
import { cn } from "@/shared/utils/dom/cn";
import { useReviewEditActions } from "../../context/reviewEdit.context";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ReviewMediaGallery } from "../media/ReviewMediaGallery.component";
import { ReviewActionsRow } from "./ReviewActionsRow.component";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { REVIEW_CLAMP_CHARS } from "../../constants/productReviews.constants";
import { RevisionNote } from "@/shared/components/display/RevisionNote.component";
import { asAuthorSees, revisionState } from "@/shared/utils/ugc/ugcRevision";

interface ProductReviewItemProps {
  review: Review;
  /** The viewer's own review: highlighted, tagged, with its moderation state. */
  pinned?: boolean;
  onVoteHelpful: () => void;
  onVoteUnhelpful: () => void;
}

export function ProductReviewItem({
  review,
  pinned = false,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewItemProps) {
  const name = review.user?.name ?? LABELS.verifiedCustomer;
  const { currentUserId, editReview, deleteReview } = useReviewEditActions();
  const isMine = Boolean(currentUserId && review.userId === currentUserId);
  const handleEdit = () => editReview(review);
  const handleDelete = () => deleteReview(review);
  // The author sees their own latest wording; everyone else, the approved review.
  const shown = isMine ? asAuthorSees(review) : review;
  const revision = isMine ? revisionState(review) : null;

  return (
    <article className={cn(styles.article, pinned && styles.pinnedArticle)}>
      <div className={styles.articleHeader}>
        <span className={styles.avatar} aria-hidden>
          {reviewerInitials(review.user?.name)}
        </span>
        <div className={styles.authorBlock}>
          <div className={styles.authorRow}>
            <p className={styles.userName}>{name}</p>
            {pinned ? (
              <span className={styles.mineTag}>{LABELS.yourReviewHeading}</span>
            ) : null}
            {pinned && review.status !== REVIEW_STATUS.APPROVED ? (
              <span className={styles.pendingTag}>
                {reviewStatusText(review.status)}
              </span>
            ) : null}
            {revision === "pending" ? (
              <span className={styles.pendingTag}>
                {LABELS.editAwaitingTag}
              </span>
            ) : null}
            {review.status === REVIEW_STATUS.APPROVED ? (
              <span className={styles.verified}>
                <BadgeCheck className={styles.verifiedIcon} aria-hidden />
                {LABELS.verifiedPurchase}
              </span>
            ) : null}
          </div>
          <div className={styles.ratingRow}>
            <RatingStars value={shown.rating} size="sm" />
            <time dateTime={review.createdAt} className={styles.reviewDate}>
              {formatOrderDate(review.createdAt)}
            </time>
            {review.editedAt ? (
              <span className={styles.editedTag}>{LABELS.editedTag}</span>
            ) : null}
          </div>
        </div>
      </div>

      {shown.title ? (
        <h3 className={styles.reviewTitle}>{shown.title}</h3>
      ) : null}
      {shown.body?.trim() ? (
        <ExpandableText
          text={shown.body}
          threshold={REVIEW_CLAMP_CHARS}
          lines={4}
          className={styles.reviewBody}
        />
      ) : null}
      <ReviewMediaGallery media={shown.media} />
      <RevisionNote state={revision} />

      {review.vendorResponse ? (
        <div className={styles.sellerResponse}>
          <p className={styles.sellerTitle}>
            <Store className={styles.sellerIcon} aria-hidden />
            {LABELS.sellerResponse}
            {review.vendorRespondedAt ? (
              <span className={styles.sellerDate}>
                {formatOrderDate(review.vendorRespondedAt)}
              </span>
            ) : null}
          </p>
          <p className={styles.sellerBody}>{review.vendorResponse}</p>
        </div>
      ) : null}

      <ReviewActionsRow
        review={review}
        isMine={isMine}
        onVoteHelpful={onVoteHelpful}
        onVoteUnhelpful={onVoteUnhelpful}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </article>
  );
}
