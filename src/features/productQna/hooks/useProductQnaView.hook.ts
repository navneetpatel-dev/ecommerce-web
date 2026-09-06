"use client";

import { useProductQuestions } from "../api/productQna.queries";
import type { ProductQuestion } from "@/shared/api/types";

export function useProductQnaView(
  productId: string,
  options: { enabled?: boolean } = {},
) {
  const { data, isLoading } = useProductQuestions(productId, options);

  return {
    questions: (data?.items ?? []) as ProductQuestion[],
    isLoading,
  };
}
