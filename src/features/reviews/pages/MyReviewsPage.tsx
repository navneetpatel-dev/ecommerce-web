"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { PATHS } from "@/shared/constants/paths";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { useMyReviews } from "../api/reviews.queries";

export function MyReviewsPage() {
  const { data, isLoading, isError, error } = useMyReviews();
  const reviews = data ?? [];

  return (
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 max-w-2xl">
        <h1 className="font-display text-[1.75rem] text-ink md:text-[2rem]">
          Your reviews
        </h1>
        <p className="mt-2 text-[0.9375rem] text-ink-muted">
          Feedback you&apos;ve left on products after delivery.
        </p>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {(error as Error)?.message || "Could not load reviews."}
        </p>
      ) : reviews.length === 0 ? (
        <div className="border border-dashed border-line bg-paper/50">
          <EmptyState
            icon={Star}
            heading="No reviews yet"
            message="After an order is delivered, you can leave a review from the order page."
            actionLabel="View orders"
            actionTo={PATHS.orders}
            className="py-14"
          />
        </div>
      ) : (
        <ul className="divide-y divide-line border border-line bg-surface-raised">
          {reviews.map((review) => (
            <li key={review.id} className="px-5 py-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {review.product ? (
                    <Link
                      href={PATHS.product(review.product.slug)}
                      className="font-medium text-ink hover:text-brand"
                    >
                      {review.product.name}
                    </Link>
                  ) : (
                    <p className="font-medium text-ink">Product</p>
                  )}
                  <p className="mt-1 flex items-center gap-1 text-[0.8125rem] text-ink-muted">
                    <Star size={12} className="fill-brand text-brand" />
                    {review.rating}/5
                    <span className="text-ink-faint">
                      · {formatOrderDate(review.createdAt)}
                    </span>
                  </p>
                </div>
                <Badge variant="outline">{review.status}</Badge>
              </div>
              {review.title ? (
                <p className="mt-3 font-medium text-ink">{review.title}</p>
              ) : null}
              <p className="mt-1 text-[0.9375rem] text-ink-muted whitespace-pre-wrap">
                {review.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
