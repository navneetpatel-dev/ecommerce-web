"use client";

import { BadgeCheck, Pencil, Store, ThumbsDown, ThumbsUp } from "lucide-react";
import { RatingStars } from "@/shared/components/display/RatingStars.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { REVIEW_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { Review } from "@/shared/api/types";
import { reviewerInitials } from "../../utils/productReviews.utils";
import { useReviewEditActions } from "../../context/reviewEdit.context";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ReviewMediaGallery } from "../media/ReviewMediaGallery.component";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { REVIEW_CLAMP_CHARS } from "../../constants/productReviews.constants";

interface ProductReviewItemProps {
  review: Review;
  onVoteHelpful: () => void;
  onVoteUnhelpful: () => void;
}

export function ProductReviewItem({
  review,
  onVoteHelpful,
  onVoteUnhelpful,
}: ProductReviewItemProps) {
  const name = review.user?.name ?? LABELS.verifiedCustomer;
  const { currentUserId, editReview } = useReviewEditActions();
  const isMine = Boolean(currentUserId && review.userId === currentUserId);
  const handleEdit = () => editReview(review);

  return (
    <article className={styles.article}>
      <div className={styles.articleHeader}>
        <span className={styles.avatar} aria-hidden>
          {reviewerInitials(review.user?.name)}
        </span>
        <div className={styles.authorBlock}>
          <div className={styles.authorRow}>
            <p className={styles.userName}>{name}</p>
            {review.status === REVIEW_STATUS.APPROVED ? (
              <span className={styles.verified}>
                <BadgeCheck className={styles.verifiedIcon} aria-hidden />
                {LABELS.verifiedPurchase}
              </span>
            ) : null}
          </div>
          <div className={styles.ratingRow}>
            <RatingStars value={review.rating} size="sm" />
            <time dateTime={review.createdAt} className={styles.reviewDate}>
              {formatOrderDate(review.createdAt)}
            </time>
            {review.editedAt ? (
              <span className={styles.editedTag}>{LABELS.editedTag}</span>
            ) : null}
          </div>
        </div>
      </div>

      {review.title ? (
        <h3 className={styles.reviewTitle}>{review.title}</h3>
      ) : null}
      <ExpandableText
        text={review.body}
        threshold={REVIEW_CLAMP_CHARS}
        lines={4}
        className={styles.reviewBody}
      />
      <ReviewMediaGallery media={review.media} />

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

      <div className={styles.voteRow}>
        {isMine ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={styles.voteButton}
            aria-label={LABELS.editReviewAria}
            onClick={handleEdit}
          >
            <Pencil className={styles.voteIcon} aria-hidden />
            {LABELS.edit}
          </Button>
        ) : null}
        <span className={styles.voteLabel}>{LABELS.wasThisHelpful}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={styles.voteButton}
          aria-label={formatLabel(LABELS.markHelpful, {
            count: review.helpfulCount,
          })}
          onClick={onVoteHelpful}
        >
          <ThumbsUp className={styles.voteIcon} aria-hidden />
          {review.helpfulCount}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={styles.voteButton}
          aria-label={formatLabel(LABELS.markUnhelpful, {
            count: review.unhelpfulCount,
          })}
          onClick={onVoteUnhelpful}
        >
          <ThumbsDown className={styles.voteIcon} aria-hidden />
          {review.unhelpfulCount}
        </Button>
      </div>
    </article>
  );
}
