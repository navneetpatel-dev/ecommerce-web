"use client";

import { createContext, useContext } from "react";
import type { Review } from "@/shared/api/types";

export interface ReviewEditActions {
  /** Signed-in shopper, to show "Edit" on their own reviews only. */
  currentUserId: string | null;
  editReview: (review: Review) => void;
}

export const ReviewEditContext = createContext<ReviewEditActions>({
  currentUserId: null,
  editReview: () => undefined,
});

/** Owner edit action for review rows (no-op outside a `ReviewEditProvider`). */
export function useReviewEditActions(): ReviewEditActions {
  return useContext(ReviewEditContext);
}
