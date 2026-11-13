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
import { updateReviewInCaches } from "./reviewCache";

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
    // In place (no refetch): the edited review stays where the shopper sees it,
    // now marked as awaiting approval; nothing around it re-orders.
    onSuccess: (saved, { reviewId }) =>
      updateReviewInCaches(queryClient, reviewId, (review) => ({
        ...review,
        rating: saved.rating,
        title: saved.title,
        body: saved.body,
        media: saved.media ?? review.media,
        status: saved.status,
        editedAt: saved.editedAt ?? new Date().toISOString(),
      })),
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.remove(reviewId),
    onSuccess: (_result, reviewId) => {
      // Only this review leaves; every other row stays exactly where it was.
      updateReviewInCaches(queryClient, reviewId, () => null);
      // The order line is free again: refresh the small "write a review" prompts.
      void queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === reviewKeys.all[0] &&
          (query.queryKey[1] === "eligibility" ||
            query.queryKey[1] === "awaiting"),
      });
    },
  });
}

export function useVoteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { reviewId: string; vote: "HELPFUL" | "UNHELPFUL" }) =>
      reviewsApi.vote(input.reviewId, input.vote),
    // New counts in place — no refetch, so "Most helpful" does not re-rank
    // the list under the shopper's cursor.
    onSuccess: (saved, { reviewId }) =>
      updateReviewInCaches(queryClient, reviewId, (review) => ({
        ...review,
        helpfulCount: saved.helpfulCount,
        unhelpfulCount: saved.unhelpfulCount,
      })),
  });
}
