"use client";

import { useRef, useState } from "react";
import { flattenPages } from "@/shared/api/client/pagination";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { motionSafeScrollBehavior } from "@/shared/utils/a11y/scrollMotion";
import type { ProductQuestion } from "@/shared/api/types";
import { useQuestionAnswers } from "../../api/qna/productQna.queries";
import { moreAnswersLabel } from "../../utils/productQna.utils";

/** Bring an element to the top of the view (smoothly, unless reduced motion). */
function scrollToStart(element: Element | null | undefined) {
  element?.scrollIntoView({
    behavior: motionSafeScrollBehavior(),
    block: "start",
  });
}

/**
 * A question's answers, sized for threads of any length: the list carries only
 * the best answer plus a count; opening the thread fetches 10 at a time
 * ("Load more answers"), so a 100k-answer question costs one small page.
 *
 * Scrolling follows the reader: after "Load more" the first new answer slides
 * to the top; after "Show fewer" (which removes a lot of height) the question
 * comes back into view instead of leaving them somewhere further down the page.
 */
export function useAnswerThread(question: ProductQuestion) {
  const articleRef = useRef<HTMLElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const total = question.answerCount ?? question.answers.length;
  const hiddenCount = Math.max(0, total - question.answers.length);
  const thread = useQuestionAnswers(question.id, expanded && hiddenCount > 0);
  const loaded = flattenPages(thread.data);
  const showThread = expanded && loaded.length > 0;

  const loadMore = async () => {
    const result = await thread.fetchNextPage();
    const pages = result.data?.pages ?? [];
    const firstNew = pages[pages.length - 1]?.items.find(
      (answer) => answer.id !== question.myAnswer?.id,
    );
    if (!firstNew) return;
    requestAnimationFrame(() =>
      scrollToStart(
        articleRef.current?.querySelector(
          `[data-answer-id="${CSS.escape(firstNew.id)}"]`,
        ),
      ),
    );
  };

  const toggle = () => {
    if (!expanded) {
      setExpanded(true);
      return;
    }
    setExpanded(false);
    // Only scroll back when the question's top has gone above the viewport.
    requestAnimationFrame(() => {
      const article = articleRef.current;
      if (article && article.getBoundingClientRect().top < 0)
        scrollToStart(article);
    });
  };

  return {
    articleRef,
    thread: {
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
      toggle,
      loadMore: () => void loadMore(),
      retry: () => void thread.refetch(),
    },
  };
}

export type AnswerThreadState = ReturnType<typeof useAnswerThread>["thread"];
