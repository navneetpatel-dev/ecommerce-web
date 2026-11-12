"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { nextPageOf } from "@/shared/api/client/pagination";
import { useRouter } from "next/navigation";
import { reviewsApi } from "./reviews.api";
import { navigate } from "@/shared/utils/navigation/navigate";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { PATHS } from "@/shared/constants/paths/paths";

export const reviewKeys = {
  all: ["reviews"] as const,
  product: (productId: string) =>
    [...reviewKeys.all, "product", productId] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
};

export function useProductReviews(
  productId: string,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: reviewKeys.product(productId),
    queryFn: () => reviewsApi.forProduct(productId),
    enabled: Boolean(productId) && (options.enabled ?? true),
    staleTime: 1000 * 60,
  });
}

export function useMyReviews() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: reviewKeys.mine(),
    queryFn: ({ pageParam }) => reviewsApi.myReviews(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: Boolean(accessToken),
  });
}

export function useSubmitReview() {
  const router = useRouter();
  return useMutation({
    mutationFn: (input: Parameters<typeof reviewsApi.submit>[0]) =>
      reviewsApi.submit(input),
    onSuccess: () => {
      navigate(router, PATHS.orders);
    },
  });
}

export function useVoteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { reviewId: string; vote: "HELPFUL" | "UNHELPFUL" }) =>
      reviewsApi.vote(input.reviewId, input.vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}
