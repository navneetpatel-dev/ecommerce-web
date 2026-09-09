"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/QueryErrorAlert.component";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { useMyReviews } from "../api/reviews.queries";
import { myReviewsPageStyles as styles } from "./myReviewsPage.styles";

export function MyReviewsPage() {
  const { data, isLoading, isError, error } = useMyReviews();
  const reviews = data ?? [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your reviews</h1>
        <p className={styles.subtitle}>
          Feedback you&apos;ve left on products after delivery.
        </p>
      </header>

      {isLoading ? (
        <div className={styles.loadingSkeletonStack}>
          <Skeleton className={styles.skeleton} />
          <Skeleton className={styles.skeleton} />
        </div>
      ) : isError ? (
        <div className={styles.errorContainer}>
          <QueryErrorAlert
            error={error}
            fallback={LABELS.couldNotLoadReviews}
          />
        </div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyContainer}>
          <EmptyState
            icon={Star}
            heading="No reviews yet"
            message="After an order is delivered, you can leave a review from the order page."
            actionLabel="View orders"
            actionTo={PATHS.orders}
            className={styles.emptyState}
          />
        </div>
      ) : (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
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
                    <p className={styles.productFallback}>Product</p>
                  )}
                  <p className={styles.ratingRow}>
                    <Star size={12} className={styles.starIcon} />
                    {review.rating}/5
                    <span className={styles.dateText}>
                      · {formatOrderDate(review.createdAt)}
                    </span>
                  </p>
                </div>
                <Badge variant="outline">{review.status}</Badge>
              </div>
              {review.title ? (
                <p className={styles.reviewTitle}>{review.title}</p>
              ) : null}
              <p className={styles.reviewBody}>{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
