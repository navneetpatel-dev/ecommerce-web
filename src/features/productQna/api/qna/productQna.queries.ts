"use client";

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { productQnaApi } from "./productQna.api";
import { nextPageOf } from "@/shared/api/client/pagination";
import { ANSWER_THREAD_PAGE_SIZE } from "../../constants/productQna.constants";
import type { ProductQuestionsParams } from "../../types/productQna.types";

export const productQnaKeys = {
  all: ["productQna"] as const,
  product: (productId: string) =>
    [...productQnaKeys.all, "product", productId] as const,
  productList: (productId: string, params: ProductQuestionsParams) =>
    [...productQnaKeys.product(productId), "list", params] as const,
  pending: () => [...productQnaKeys.all, "pending"] as const,
  myQuestions: () => [...productQnaKeys.all, "mine", "questions"] as const,
  myAnswers: () => [...productQnaKeys.all, "mine", "answers"] as const,
};

export function useProductQuestions(
  productId: string,
  params: ProductQuestionsParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productQnaKeys.productList(productId, params),
    queryFn: () => productQnaApi.forProduct(productId, params),
    enabled: Boolean(productId) && (options.enabled ?? true),
    staleTime: 1000 * 60,
    // Keep the current page on screen while the next filter/page loads.
    placeholderData: keepPreviousData,
  });
}

/** A question's answer thread, a page at a time, fetched only once opened. */
export function useQuestionAnswers(questionId: string, enabled: boolean) {
  return useInfiniteQuery({
    queryKey: [...productQnaKeys.all, "answers", questionId] as const,
    queryFn: ({ pageParam }) =>
      productQnaApi.answers(questionId, {
        page: pageParam,
        limit: ANSWER_THREAD_PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: Boolean(questionId) && enabled,
    staleTime: 1000 * 60,
  });
}

export function useMyQuestions() {
  return useInfiniteQuery({
    queryKey: productQnaKeys.myQuestions(),
    queryFn: ({ pageParam }) => productQnaApi.myQuestions(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });
}

export function useMyAnswers() {
  return useInfiniteQuery({
    queryKey: productQnaKeys.myAnswers(),
    queryFn: ({ pageParam }) => productQnaApi.myAnswers(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
  });
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { questionId: string; question: string }) =>
      productQnaApi.updateQuestion(input.questionId, {
        question: input.question,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productQnaKeys.all }),
  });
}

export function useUpdateAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { answerId: string; answer: string }) =>
      productQnaApi.updateAnswer(input.answerId, { answer: input.answer }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: productQnaKeys.all }),
  });
}

export function useCanAnswer(productId: string, signedIn: boolean) {
  return useQuery({
    queryKey: [...productQnaKeys.product(productId), "can-answer"],
    queryFn: () => productQnaApi.canAnswer(productId),
    enabled: Boolean(productId) && signedIn,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePendingQuestions() {
  return useQuery({
    queryKey: productQnaKeys.pending(),
    queryFn: () => productQnaApi.pending(),
  });
}

export function useAskQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { productId: string; question: string }) =>
      productQnaApi.ask(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQnaKeys.product(variables.productId),
      });
    },
  });
}

export function useAnswerQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { questionId: string; answer: string }) =>
      productQnaApi.answer(input.questionId, { answer: input.answer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQnaKeys.all });
    },
  });
}

export function useModerateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      questionId: string;
      status: "PUBLISHED" | "REJECTED";
    }) => productQnaApi.moderate(input.questionId, { status: input.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQnaKeys.all });
    },
  });
}
