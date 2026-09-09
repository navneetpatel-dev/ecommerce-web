"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productQnaApi } from "./productQna.api";

export const productQnaKeys = {
  all: ["productQna"] as const,
  product: (productId: string) =>
    [...productQnaKeys.all, "product", productId] as const,
  pending: () => [...productQnaKeys.all, "pending"] as const,
};

export function useProductQuestions(
  productId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: productQnaKeys.product(productId),
    queryFn: () => productQnaApi.forProduct(productId),
    enabled: Boolean(productId) && (options.enabled ?? true),
    staleTime: 1000 * 60,
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
