"use client";

import { flattenPages } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useMyAnswers, useMyQuestions } from "../../api/qna/productQna.queries";
import type { MyQnaListState } from "../../components/mine/MyQnaListShell.component";

type InfiniteQuery =
  ReturnType<typeof useMyQuestions> | ReturnType<typeof useMyAnswers>;

function listState(
  query: InfiniteQuery,
  countTemplate: string,
): MyQnaListState {
  const count = query.data?.pages[0]?.total ?? 0;
  return {
    count,
    countLabel: formatLabel(countTemplate, {
      count: count.toLocaleString("en-IN"),
    }),
    isLoading: query.isLoading,
    isError: query.isError && !query.data,
    error: query.error,
    retry: () => void query.refetch(),
    hasNextPage: Boolean(query.hasNextPage),
    isFetchingNextPage: query.isFetchingNextPage,
    loadMore: () => void query.fetchNextPage(),
  };
}

/** "My questions": everything the shopper asked, a page at a time. */
export function useMyQuestionsPage() {
  const query = useMyQuestions();
  return {
    questions: flattenPages(query.data),
    state: listState(query, LABELS.questionCountTotal),
  };
}

/** "My answers": everything the shopper answered, a page at a time. */
export function useMyAnswersPage() {
  const query = useMyAnswers();
  return {
    answers: flattenPages(query.data),
    state: listState(query, LABELS.answerCountTotal),
  };
}
