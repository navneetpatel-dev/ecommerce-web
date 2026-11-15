"use client";

import { useEffect, useState } from "react";
import { reviewsApi } from "@/features/reviews";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import type { Review } from "@/shared/api/types";

export function useVendorReviewsPage() {
  const vendorId = useAuthStore((state) => state.currentUser?.vendorId);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) return;

    let cancelled = false;

    void reviewsApi
      .forVendorMe()
      .then((items) => {
        if (!cancelled) {
          setReviews(items);
          setLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setReviews([]);
          setLoadError(getApiErrorMessage(err, LABELS.couldNotLoadReviews));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const handleRespond = async (reviewId: string, response: string) => {
    setSubmitting(true);
    try {
      await reviewsApi.respond(reviewId, { response });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                vendorResponse: response.trim() || null,
                vendorRespondedAt: response.trim()
                  ? new Date().toISOString()
                  : null,
              }
            : r,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlagReview = async (reviewId: string, reason: string) => {
    setSubmitting(true);
    try {
      await reviewsApi.flag(reviewId, { reason });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                flaggedReason: reason.trim(),
              }
            : r,
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews,
    isLoading: vendorId ? isLoading : false,
    loadError,
    submitting,
    handleRespond,
    handleFlagReview,
  };
}
