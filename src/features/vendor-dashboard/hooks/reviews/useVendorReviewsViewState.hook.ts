"use client";

import { useState, useCallback } from "react";
import type { Review } from "@/shared/api/types";

interface UseVendorReviewsViewStateOptions {
  reviews: Review[];
  onRespond: (reviewId: string, response: string) => void | Promise<void>;
  onFlag?: (reviewId: string, reason: string) => void | Promise<void>;
}

export function useVendorReviewsViewState({
  reviews,
  onRespond,
  onFlag,
}: UseVendorReviewsViewStateOptions) {
  const [targetId, setTargetId] = useState<string | null>(null);
  const [flagTargetId, setFlagTargetId] = useState<string | null>(null);

  const activeReview = reviews.find((r) => r.id === targetId);

  const handleOpenRespond = useCallback((reviewId: string) => {
    setTargetId(reviewId);
  }, []);

  const handleOpenFlag = useCallback((reviewId: string) => {
    setFlagTargetId(reviewId);
  }, []);

  const handleRespondOpenChange = useCallback((open: boolean) => {
    if (!open) setTargetId(null);
  }, []);

  const handleFlagOpenChange = useCallback((open: boolean) => {
    if (!open) setFlagTargetId(null);
  }, []);

  const handleRespondSubmit = useCallback(
    (response: string) => {
      if (!targetId) return;
      void Promise.resolve(onRespond(targetId, response)).then(() =>
        setTargetId(null),
      );
    },
    [onRespond, targetId],
  );

  const handleFlagSubmit = useCallback(
    (reason: string) => {
      if (!flagTargetId || !onFlag) return;
      void Promise.resolve(onFlag(flagTargetId, reason)).then(() =>
        setFlagTargetId(null),
      );
    },
    [flagTargetId, onFlag],
  );

  const handleRemoveReply = useCallback(
    (reviewId: string) => {
      void onRespond(reviewId, "");
    },
    [onRespond],
  );

  return {
    targetId,
    flagTargetId,
    activeReview,
    handleOpenRespond,
    handleOpenFlag,
    handleRespondOpenChange,
    handleFlagOpenChange,
    handleRespondSubmit,
    handleFlagSubmit,
    handleRemoveReply,
  };
}
