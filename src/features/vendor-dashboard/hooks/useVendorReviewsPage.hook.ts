"use client";

import { useEffect, useState } from "react";
import { reviewsApi } from "@/features/reviews";
import { useAuthStore } from "@/shared/stores/auth.store";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import type { Review } from "@/shared/api/types";

export function useVendorReviewsPage() {
  const vendorId = useAuthStore((state) => state.currentUser?.vendorId);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);

    void reviewsApi
      .forVendorMe()
      .then((items) => {
        if (!cancelled) setReviews(items);
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
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } finally {
      setSubmitting(false);
    }
  };

  return { reviews, isLoading, loadError, submitting, handleRespond };
}
