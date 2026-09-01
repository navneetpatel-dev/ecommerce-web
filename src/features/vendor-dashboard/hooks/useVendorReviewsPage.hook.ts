"use client";

import { useEffect, useState } from "react";
import { productsApi } from "@/features/products";
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

    void productsApi
      .list({ vendorId, limit: 100 })
      .then(async ({ items }) => {
        const grouped = await Promise.all(
          items.map((product) => reviewsApi.forProduct(product.id)),
        );
        if (!cancelled) setReviews(grouped.flat());
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
