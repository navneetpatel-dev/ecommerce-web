"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productQnaApi } from "./productQna.api";
import { productQnaKeys } from "./productQna.queries";
import {
  updateAnswerInCaches,
  updateQuestionInCaches,
} from "./productQnaCache";

/** Text + moderation state from a saved edit, merged into the copy on screen. */
function editedFields<T extends { status?: unknown; editedAt?: string | null }>(
  saved: Partial<T>,
  current: T,
): Pick<T, "status" | "editedAt"> {
  return {
    status: saved.status ?? current.status,
    editedAt: saved.editedAt ?? new Date().toISOString(),
  };
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
    onSuccess: (saved, { questionId, question }) =>
      updateQuestionInCaches(queryClient, questionId, (current) => ({
        ...current,
        question,
        ...editedFields(saved, current),
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
    onSuccess: (saved, { answerId, answer }) =>
      updateAnswerInCaches(queryClient, answerId, (current) => ({
        ...current,
        answer,
        ...editedFields(saved, current),
      })),
  });
}
