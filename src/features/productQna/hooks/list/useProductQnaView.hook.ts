"use client";

import { useProductQuestions } from "../../api/qna/productQna.queries";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  PDP_QUESTION_PREVIEW_LIMIT,
  PDP_QUESTION_SORT,
} from "../../constants/productQna.constants";
import { EMPTY_QNA_SUMMARY } from "../../utils/productQna.utils";

const PREVIEW_PARAMS = {
  limit: PDP_QUESTION_PREVIEW_LIMIT,
  sort: PDP_QUESTION_SORT,
} as const;

/** PDP Q&A: the answered summary plus the best-answered few questions. */
export function useProductQnaView(
  productId: string,
  productSlug: string,
  options: { enabled?: boolean } = {},
) {
  const query = useProductQuestions(productId, PREVIEW_PARAMS, options);
  const summary = query.data?.summary ?? EMPTY_QNA_SUMMARY;
  // Includes the viewer's own pending questions, which the summary leaves out.
  const listed = query.data?.total ?? 0;

  return {
    questions: query.data?.items ?? [],
    summary,
    isLoading: query.isLoading,
    isError: query.isError && !query.data,
    retry: () => void query.refetch(),
    allQuestionsHref: PATHS.productQuestions(productSlug),
    viewAllLabel: formatLabel(LABELS.viewAllQuestions, {
      count: summary.total.toLocaleString("en-IN"),
    }),
    hasMore: listed > PDP_QUESTION_PREVIEW_LIMIT,
  };
}
