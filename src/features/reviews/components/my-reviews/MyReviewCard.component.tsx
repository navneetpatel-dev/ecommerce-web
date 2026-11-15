"use client";

import Link from "next/link";
import { Star, Store } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Review } from "@/shared/api/types";
import { useReviewEditActions } from "../../context/reviewEdit.context";
import { REVIEW_CLAMP_CHARS } from "../../constants/productReviews.constants";
import { reviewStatusText } from "../../utils/productReviews.utils";
import { ReviewMediaGallery } from "../media/ReviewMediaGallery.component";
import { RevisionNote } from "@/shared/components/display/RevisionNote.component";
import { asAuthorSees, revisionState } from "@/shared/utils/ugc/ugcRevision";
import { myReviewsPageStyles as styles } from "../../pages/my-reviews/myReviewsPage.styles";

export function MyReviewCard({ review }: { review: Review }) {
  const { editReview, deleteReview } = useReviewEditActions();
  const handleEdit = () => editReview(review);
  const handleDelete = () => deleteReview(review);
  // Their latest wording (an edit may still be awaiting approval).
  const shown = asAuthorSees(review);
  const revision = revisionState(review);

  return (
    <li className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <div className={styles.productInfo}>
          {review.product ? (
            <Link
              href={PATHS.product(review.product.slug)}
              className={styles.productLink}
            >
              {review.product.name}
            </Link>
          ) : (
            <p className={styles.productFallback}>{LABELS.product}</p>
          )}
          <p className={styles.ratingRow}>
            <Star size={12} className={styles.starIcon} aria-hidden />
            {shown.rating}/5
            <span className={styles.dateText}>
              · {formatOrderDate(review.createdAt)}
            </span>
            {review.editedAt ? (
              <span className={styles.editedTag}>{LABELS.editedTag}</span>
            ) : null}
          </p>
        </div>
        <div className={styles.cardActions}>
          <Badge variant="outline">
            {revision === "pending"
              ? LABELS.editAwaitingTag
              : reviewStatusText(review.status)}
          </Badge>
          <OwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            editLabel={LABELS.editReviewAria}
            deleteLabel={LABELS.deleteReviewAria}
          />
        </div>
      </div>
      {shown.title ? <p className={styles.reviewTitle}>{shown.title}</p> : null}
      <ExpandableText
        text={shown.body}
        threshold={REVIEW_CLAMP_CHARS}
        lines={4}
        className={styles.reviewBody}
      />
      <ReviewMediaGallery media={shown.media} />
      <RevisionNote state={revision} />
      {review.vendorResponse ? (
        <div className={styles.sellerResponse}>
          <p className={styles.sellerTitle}>
            <Store className={styles.sellerIcon} aria-hidden />
            {LABELS.sellerResponse}
            {review.vendorRespondedAt ? (
              <span className={styles.sellerDate}>
                {" · "}
                {formatOrderDate(review.vendorRespondedAt)}
              </span>
            ) : null}
          </p>
          <p className={styles.sellerBody}>{review.vendorResponse}</p>
        </div>
      ) : null}
    </li>
  );
}
