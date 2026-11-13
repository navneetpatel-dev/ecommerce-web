"use client";

import Link from "next/link";
import { Pencil, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { Review } from "@/shared/api/types";
import { useReviewEditActions } from "../../context/reviewEdit.context";
import { REVIEW_CLAMP_CHARS } from "../../constants/productReviews.constants";
import { reviewStatusText } from "../../utils/productReviews.utils";
import { ReviewMediaGallery } from "../media/ReviewMediaGallery.component";
import { myReviewsPageStyles as styles } from "../../pages/my-reviews/myReviewsPage.styles";

export function MyReviewCard({ review }: { review: Review }) {
  const { editReview } = useReviewEditActions();
  const handleEdit = () => editReview(review);

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
            {review.rating}/5
            <span className={styles.dateText}>
              · {formatOrderDate(review.createdAt)}
            </span>
            {review.editedAt ? (
              <span className={styles.editedTag}>{LABELS.editedTag}</span>
            ) : null}
          </p>
        </div>
        <div className={styles.cardActions}>
          <Badge variant="outline">{reviewStatusText(review.status)}</Badge>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={styles.editButton}
            aria-label={LABELS.editReviewAria}
            onClick={handleEdit}
          >
            <Pencil className={styles.editIcon} aria-hidden />
            {LABELS.edit}
          </Button>
        </div>
      </div>
      {review.title ? (
        <p className={styles.reviewTitle}>{review.title}</p>
      ) : null}
      <ExpandableText
        text={review.body}
        threshold={REVIEW_CLAMP_CHARS}
        lines={4}
        className={styles.reviewBody}
      />
      <ReviewMediaGallery media={review.media} />
    </li>
  );
}
