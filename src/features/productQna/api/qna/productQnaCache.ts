import type { InfiniteData, Query, QueryClient } from "@tanstack/react-query";
import type { PaginatedList } from "@/shared/api/client/pagination";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import { PRODUCT_QUESTION_STATUS } from "@/shared/constants/statuses";
import type { ProductQuestionPage } from "../../types/productQna.types";

/**
 * In-place cache edits for Q&A. After an answer / question is posted, edited or
 * deleted we patch the rows already on screen instead of refetching: a refetch
 * re-ranks "Most answered", can drop a question out of the "Answered" filter or
 * the PDP's top five, and collapses open threads — the shopper's place is lost.
 * Only the item acted on changes; the next visit brings fresh ordering.
 */
const ROOT = "productQna";
type Updater<T> = (item: T) => T | null;

const isQuestionList = (q: Query) =>
  q.queryKey[0] === ROOT && q.queryKey[3] === "list";
const isThread = (q: Query) =>
  q.queryKey[0] === ROOT && q.queryKey[1] === "answers";
const isMine = (kind: "questions" | "answers") => (q: Query) =>
  q.queryKey[0] === ROOT && q.queryKey[1] === "mine" && q.queryKey[2] === kind;

const isPublished = (item: { status?: string } | null | undefined) =>
  item?.status === PRODUCT_QUESTION_STATUS.PUBLISHED;

function patchList<T extends { id: string }>(
  items: T[],
  id: string,
  update: Updater<T>,
) {
  let removed: T | null = null;
  const next = items.flatMap((item) => {
    if (item.id !== id) return [item];
    const updated = update(item);
    if (!updated) removed = item;
    return updated ? [updated] : [];
  });
  return { items: next, removed: removed as T | null };
}

function patchInfinite<T extends { id: string }>(
  data: InfiniteData<PaginatedList<T>> | undefined,
  id: string,
  update: Updater<T>,
) {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => {
      const { items, removed } = patchList(page.items, id, update);
      return {
        ...page,
        items,
        total: removed ? Math.max(0, page.total - 1) : page.total,
      };
    }),
  };
}

/**
 * One answer changed or removed: the asker's pinned copy, previews, threads,
 * My answers. An edit keeps the answer where it is (now awaiting approval);
 * only a deletion takes a published answer out of the question's count.
 */
export function updateAnswerInCaches(
  queryClient: QueryClient,
  answerId: string,
  update: Updater<ProductAnswer>,
): void {
  queryClient.setQueriesData<ProductQuestionPage>(
    { predicate: isQuestionList },
    (page) => {
      if (!page) return page;
      let answeredDelta = 0;
      const items = page.items.map((question) => {
        const isMyAnswer = question.myAnswer?.id === answerId;
        const before = isMyAnswer
          ? question.myAnswer
          : question.answers.find((answer) => answer.id === answerId);
        if (!before) return question;
        const after = update(before);
        const count = question.answerCount ?? 0;
        const answerCount =
          !after && isPublished(before) ? Math.max(0, count - 1) : count;
        if (count > 0 && answerCount === 0) answeredDelta -= 1;
        return {
          ...question,
          answerCount,
          myAnswer: isMyAnswer ? after : question.myAnswer,
          answers: patchList(question.answers, answerId, update).items,
        };
      });
      return {
        ...page,
        items,
        summary: {
          ...page.summary,
          answered: Math.max(0, page.summary.answered + answeredDelta),
        },
      };
    },
  );
  for (const predicate of [isThread, isMine("answers")]) {
    queryClient.setQueriesData<InfiniteData<PaginatedList<ProductAnswer>>>(
      { predicate },
      (data) => patchInfinite(data, answerId, update),
    );
  }
}

/** One question changed or removed, in the product lists and My questions. */
export function updateQuestionInCaches(
  queryClient: QueryClient,
  questionId: string,
  update: Updater<ProductQuestion>,
): void {
  queryClient.setQueriesData<ProductQuestionPage>(
    { predicate: isQuestionList },
    (page) => {
      if (!page) return page;
      const { items, removed } = patchList(page.items, questionId, update);
      if (!removed) return { ...page, items };
      const counted = isPublished(removed);
      return {
        ...page,
        items,
        total: Math.max(0, page.total - 1),
        summary: {
          total: Math.max(0, page.summary.total - (counted ? 1 : 0)),
          answered: Math.max(
            0,
            page.summary.answered -
              (counted && (removed.answerCount ?? 0) > 0 ? 1 : 0),
          ),
        },
      };
    },
  );
  queryClient.setQueriesData<InfiniteData<PaginatedList<ProductQuestion>>>(
    { predicate: isMine("questions") },
    (data) => patchInfinite(data, questionId, update),
  );
}

/** The viewer just answered: pin it on that question, nothing else moves. */
export function setMyAnswerInCaches(
  queryClient: QueryClient,
  questionId: string,
  answer: ProductAnswer,
): void {
  queryClient.setQueriesData<ProductQuestionPage>(
    { predicate: isQuestionList },
    (page) =>
      page
        ? {
            ...page,
            items: page.items.map((question) =>
              question.id === questionId
                ? {
                    ...question,
                    myAnswer: answer,
                    answerCount:
                      (question.answerCount ?? 0) +
                      (isPublished(answer) ? 1 : 0),
                  }
                : question,
            ),
          }
        : page,
  );
}
