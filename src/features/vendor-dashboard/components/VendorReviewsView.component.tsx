"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import type { Review } from "@/shared/api/types";
import { VendorReviewRespondDialog } from "./VendorReviewRespondDialog.component";

interface VendorReviewsViewProps {
  reviews: Review[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onRespond: (reviewId: string, response: string) => void | Promise<void>;
}

export function VendorReviewsView({
  reviews,
  isLoading = false,
  loadError = null,
  submitting = false,
  onRespond,
}: VendorReviewsViewProps) {
  const [targetId, setTargetId] = useState<string | null>(null);

  return (
    <section className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6">
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.reviews}
          </h1>
          <p className="max-w-3xl text-body leading-relaxed text-ink-muted">
            {LABELS.vendorReviewsHint}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[8.5rem] w-full rounded-md sm:h-[9.5rem]"
            />
          ))}
        </div>
      ) : loadError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {loadError}
        </p>
      ) : null}

      {!isLoading && !loadError
        ? reviews.map((review) => (
            <article
              key={review.id}
              className="w-full overflow-hidden rounded-md border border-line bg-surface p-4 shadow-card-hairline sm:p-6"
            >
              <p className="font-medium text-ink">
                {review.title?.trim() || LABELS.reviewUntitled} ·{" "}
                {formatLabel(LABELS.reviewRatingOutOf, {
                  rating: String(review.rating),
                })}
              </p>
              {review.product?.name ? (
                <p className="mt-1 text-body-sm text-ink-muted">
                  {review.product.name}
                </p>
              ) : null}
              <p className="mt-2 text-body leading-relaxed text-ink-muted">
                {review.body}
              </p>
              <Button
                className="mt-4"
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => setTargetId(review.id)}
              >
                {LABELS.respondToReview}
              </Button>
            </article>
          ))
        : null}

      {!isLoading && !loadError && !reviews.length ? (
        <p className="text-ink-muted">{LABELS.noReviewsFound}</p>
      ) : null}

      <VendorReviewRespondDialog
        open={Boolean(targetId)}
        submitting={submitting}
        onOpenChange={(open) => {
          if (!open) setTargetId(null);
        }}
        onSubmit={(response) => {
          if (!targetId) return;
          void Promise.resolve(onRespond(targetId, response)).then(() =>
            setTargetId(null),
          );
        }}
      />
    </section>
  );
}
