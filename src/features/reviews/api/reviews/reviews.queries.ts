"use client";

import {
  keepPreviousData,
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
import type { ProductReviewsParams } from "../../types/productReviews.types";

export const reviewKeys = {
  all: ["reviews"] as const,
  product: (productId: string, params: ProductReviewsParams = {}) =>
    [...reviewKeys.all, "product", productId, params] as const,
  mine: () => [...reviewKeys.all, "mine"] as const,
  awaiting: () => [...reviewKeys.all, "awaiting"] as const,
};

export function useProductReviews(
  productId: string,
  params: ProductReviewsParams,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: reviewKeys.product(productId, params),
    queryFn: () => reviewsApi.forProduct(productId, params),
    enabled: Boolean(productId) && (options.enabled ?? true),
    staleTime: 1000 * 60,
    // Keep the current page on screen while the next filter/page loads.
    placeholderData: keepPreviousData,
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

/**
 * Posts a review. With `onSubmitted` (the dialog flow) the caller decides what
 * happens next; without it the shopper goes back to their orders, as before.
 */
/** Delivered, not-yet-reviewed products — infinite list for "Write a review". */
export function useAwaitingReviews() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useInfiniteQuery({
    queryKey: reviewKeys.awaiting(),
    queryFn: ({ pageParam }) => reviewsApi.awaiting(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPageOf,
    enabled: Boolean(accessToken),
  });
}

export function useSubmitReview(options: { onSubmitted?: () => void } = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Parameters<typeof reviewsApi.submit>[0]) =>
      reviewsApi.submit(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      if (options.onSubmitted) options.onSubmitted();
      else navigate(router, PATHS.orders);
    },
  });
}

export function useReviewEligibility(productId: string, enabled: boolean) {
  return useQuery({
    queryKey: [...reviewKeys.all, "eligibility", productId] as const,
    queryFn: () => reviewsApi.eligibility(productId),
    enabled: Boolean(productId) && enabled,
    staleTime: 1000 * 60,
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      reviewId,
      ...body
    }: { reviewId: string } & Parameters<typeof reviewsApi.update>[1]) =>
      reviewsApi.update(reviewId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.remove(reviewId),
    // Deleting frees the order line: "write a review" lists change too.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
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
