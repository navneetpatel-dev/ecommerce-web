"use client";

import { useParams } from "next/navigation";
import { useProduct } from "@/features/products";
import { useUrlQueryState } from "@/shared/hooks/navigation/useUrlQueryState.hook";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useProductReviews } from "../../api/reviews/reviews.queries";
import {
  ALL_REVIEWS_PAGE_LIMIT,
  DEFAULT_REVIEW_SORT,
  REVIEW_QUERY,
} from "../../constants/productReviews.constants";
import {
  EMPTY_REVIEW_SUMMARY,
  parseRating,
  parseReviewSort,
} from "../../utils/productReviews.utils";
import type { RatingValue, ReviewSort } from "../../types/productReviews.types";
import { useReviewVoting } from "../product-reviews/useReviewVoting.hook";

export type RatingFilterValue = "all" | `${RatingValue}`;

/** "All reviews" page: product header, URL-driven filters, one page of reviews. */
export function useAllReviewsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const productQuery = useProduct(slug);
  const product = productQuery.data ?? null;
  const { searchParams, update, hrefWith } = useUrlQueryState();
  const voting = useReviewVoting();

  const rating = parseRating(searchParams.get(REVIEW_QUERY.rating));
  const withMedia = searchParams.get(REVIEW_QUERY.media) === "1";
  const sort =
    parseReviewSort(searchParams.get(REVIEW_QUERY.sort)) ?? DEFAULT_REVIEW_SORT;
  const page = Math.max(1, Number(searchParams.get(REVIEW_QUERY.page)) || 1);

  const reviewsQuery = useProductReviews(
    product?.id ?? "",
    {
      page,
      limit: ALL_REVIEWS_PAGE_LIMIT,
      rating,
      withMedia: withMedia || undefined,
      sort,
    },
    { enabled: Boolean(product?.id) },
  );
  const data = reviewsQuery.data;
  const total = data?.total ?? 0;
  const from = total ? (page - 1) * ALL_REVIEWS_PAGE_LIMIT + 1 : 0;

  return {
    product,
    productHref: PATHS.product(slug),
    productImage:
      product?.images?.find((image) => image.isPrimary)?.url ??
      product?.images?.[0]?.url ??
      null,
    title: formatLabel(LABELS.allReviewsFor, { name: product?.name ?? "" }),
    isProductLoading: productQuery.isLoading,
    // A failed request is not a missing product: offer a retry only for the former.
    productLoadFailed: productQuery.isError && !product,
    isProductMissing: !productQuery.isLoading && !product,
    retryProduct: () => void productQuery.refetch(),
    reviews: data?.items ?? [],
    summary: data?.summary ?? EMPTY_REVIEW_SUMMARY,
    isLoading: Boolean(product) && !data && !reviewsQuery.isError,
    isFetching: reviewsQuery.isFetching,
    isError: reviewsQuery.isError && !data,
    retry: () => void reviewsQuery.refetch(),
    page,
    totalPages: data?.totalPages ?? 1,
    total,
    from,
    to: Math.min(from + ALL_REVIEWS_PAGE_LIMIT - 1, total),
    rating,
    ratingFilter: (rating ? String(rating) : "all") as RatingFilterValue,
    withMedia,
    sort,
    hasFilters: Boolean(rating) || withMedia,
    ratingHref: (value: RatingValue) =>
      hrefWith({ [REVIEW_QUERY.rating]: value }),
    setRatingFilter: (value: RatingFilterValue) =>
      update({ [REVIEW_QUERY.rating]: value === "all" ? null : value }),
    toggleWithMedia: () =>
      update({ [REVIEW_QUERY.media]: withMedia ? null : "1" }),
    setSort: (value: ReviewSort) =>
      update({
        [REVIEW_QUERY.sort]: value === DEFAULT_REVIEW_SORT ? null : value,
      }),
    setPage: (value: number) =>
      update({ [REVIEW_QUERY.page]: value > 1 ? value : null }),
    clearFilters: () =>
      update({ [REVIEW_QUERY.rating]: null, [REVIEW_QUERY.media]: null }),
    voteHelpful: voting.voteHelpful,
    voteUnhelpful: voting.voteUnhelpful,
  };
}
