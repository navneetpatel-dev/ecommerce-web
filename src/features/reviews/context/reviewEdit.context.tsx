"use client";

import { createContext, useContext } from "react";
import type { Review } from "@/shared/api/types";

export interface ReviewEditActions {
  /** Signed-in shopper, to show Edit / Delete on their own reviews only. */
  currentUserId: string | null;
  editReview: (review: Review) => void;
  deleteReview: (review: Review) => void;
}

export const ReviewEditContext = createContext<ReviewEditActions>({
  currentUserId: null,
  editReview: () => undefined,
  deleteReview: () => undefined,
});

/** Owner actions for review rows (no-ops outside a `ReviewEditProvider`). */
export function useReviewEditActions(): ReviewEditActions {
  return useContext(ReviewEditContext);
}
