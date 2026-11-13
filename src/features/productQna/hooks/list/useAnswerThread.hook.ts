"use client";

import { useState } from "react";
import { flattenPages } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductQuestion } from "@/shared/api/types";
import { useQuestionAnswers } from "../../api/qna/productQna.queries";
import { moreAnswersLabel } from "../../utils/productQna.utils";

/**
 * A question's answers, sized for threads of any length: the list carries only
 * the best answer plus a count; opening the thread fetches 10 at a time
 * ("Load more answers"), so a 100k-answer question costs one small page.
 */
export function useAnswerThread(question: ProductQuestion) {
  const [expanded, setExpanded] = useState(false);
  const total = question.answerCount ?? question.answers.length;
  const hiddenCount = Math.max(0, total - question.answers.length);
  const thread = useQuestionAnswers(question.id, expanded && hiddenCount > 0);
  const loaded = flattenPages(thread.data);
  const showThread = expanded && loaded.length > 0;

  return {
    total,
    hiddenCount,
    expanded,
    // The first page starts with the same best answer, so it replaces the preview.
    // The viewer's own answer is pinned above the thread, so it is not repeated in it.
    visible: (showThread ? loaded : question.answers).filter(
      (answer) => answer.id !== question.myAnswer?.id,
    ),
    isLoadingThread: expanded && thread.isLoading,
    isThreadError: expanded && thread.isError && !thread.data,
    hasMore: showThread && Boolean(thread.hasNextPage),
    isLoadingMore: thread.isFetchingNextPage,
    expandLabel: moreAnswersLabel(hiddenCount),
    progressLabel: thread.hasNextPage
      ? formatLabel(LABELS.answersShownOf, {
          shown: loaded.length.toLocaleString("en-IN"),
          total: total.toLocaleString("en-IN"),
        })
      : formatLabel(LABELS.allAnswersShown, {
          total: total.toLocaleString("en-IN"),
        }),
    progressPercent: total
      ? Math.min(100, Math.round((loaded.length / total) * 100))
      : 0,
    toggle: () => setExpanded((open) => !open),
    loadMore: () => void thread.fetchNextPage(),
    retry: () => void thread.refetch(),
  };
}

export type AnswerThreadState = ReturnType<typeof useAnswerThread>;
