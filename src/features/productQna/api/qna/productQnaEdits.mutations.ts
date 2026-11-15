"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productQnaApi } from "./productQna.api";
import { productQnaKeys } from "./productQna.queries";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";
import {
  updateAnswerInCaches,
  updateQuestionInCaches,
} from "./productQnaCache";

/**
 * What a saved edit changed, from the server's copy. An edit of published text
 * leaves the live text and status alone and comes back as `pendingRevision`;
 * an edit of something not yet published changes the text itself.
 */
function savedEdit<T extends ProductQuestion | ProductAnswer>(
  saved: Partial<T>,
  current: T,
): Pick<T, "status" | "editedAt" | "pendingRevision" | "revisionRejectedAt"> {
  return {
    status: saved.status ?? current.status,
    editedAt: saved.editedAt ?? current.editedAt ?? null,
    pendingRevision: saved.pendingRevision ?? null,
    revisionRejectedAt: saved.revisionRejectedAt ?? null,
  } as Pick<
    T,
    "status" | "editedAt" | "pendingRevision" | "revisionRejectedAt"
  >;
}

// Mutations patch the cached rows in place (see productQnaCache) rather than
// refetching, so the questions around the one acted on never move.
export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { questionId: string; question: string }) =>
      productQnaApi.updateQuestion(input.questionId, {
        question: input.question,
      }),
    onSuccess: (saved, { questionId }) =>
      updateQuestionInCaches(queryClient, questionId, (current) => ({
        ...current,
        question: saved.question ?? current.question,
        ...savedEdit(saved, current),
      })),
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) =>
      productQnaApi.deleteQuestion(questionId),
    onSuccess: (_data, questionId) => {
      updateQuestionInCaches(queryClient, questionId, () => null);
      queryClient.removeQueries({
        queryKey: productQnaKeys.answers(questionId),
      });
    },
  });
}

export function useDeleteAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (answerId: string) => productQnaApi.deleteAnswer(answerId),
    onSuccess: (_data, answerId) =>
      updateAnswerInCaches(queryClient, answerId, () => null),
  });
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { answerId: string; answer: string }) =>
      productQnaApi.updateAnswer(input.answerId, { answer: input.answer }),
    onSuccess: (saved, { answerId }) =>
      updateAnswerInCaches(queryClient, answerId, (current) => ({
        ...current,
        answer: saved.answer ?? current.answer,
        ...savedEdit(saved, current),
      })),
  });
}
