import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import type {
  AwaitingReviewItem,
  ProductReviewPage,
  ProductReviewsParams,
} from "../../types/productReviews.types";
import { readReviewSummary } from "../../utils/productReviews.utils";
import { API } from "@/shared/constants/apiRoutes";
import type { Review } from "@/shared/api/types";

export const reviewsApi = {
  /** One filtered page of a product's public reviews + its star summary. */
  forProduct: async (
    productId: string,
    params: ProductReviewsParams = {},
  ): Promise<ProductReviewPage> => {
    const res = await apiClient.getWithResponse<Review[]>(
      withQuery(API.reviews.forProduct(productId), { ...params }),
    );
    return {
      ...unwrapPaginatedList(res),
      summary: readReviewSummary(res.meta?.summary),
      myReview: (res.meta?.myReview as Review | null | undefined) ?? null,
    };
  },
  /** The signed-in shopper's delivered, unreviewed line for this product (or null). */
  eligibility: (productId: string) =>
    apiClient.get<{ orderItemId: string | null }>(
      `${API.reviews.forProduct(productId)}/eligibility`,
    ),
  forVendorMe: () => apiClient.get<Review[]>(API.reviews.vendorMe),
  submit: (body: {
    orderItemId: string;
    productId: string;
    rating: number;
    title?: string;
    body: string;
    /** Id the review takes; its photos/video were uploaded under it. */
    draftId?: string;
    attachments?: Array<{
      url: string;
      type: "IMAGE" | "VIDEO";
      durationSeconds?: number | null;
    }>;
  }) => apiClient.post<Review>(API.reviews.create, body),
  /** The shopper's reviews, a page at a time (B-44). */
  myReviews: async (page = 1, limit = 20): Promise<PaginatedList<Review>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<Review[]>(
        withQuery(API.reviews.mine, { page, limit }),
      ),
    ),
  /** Delivered products waiting for the shopper's review, newest first. */
  awaiting: async (
    page = 1,
    limit = 12,
  ): Promise<PaginatedList<AwaitingReviewItem>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<AwaitingReviewItem[]>(
        withQuery(`${API.reviews.create}/awaiting`, { page, limit }),
      ),
    ),
  /** Owner edit of stars and text; the review goes back to moderation. */
  update: (
    reviewId: string,
    body: {
      rating: number;
      title?: string;
      body: string;
      /** The full photo/video list after editing. */
      attachments?: Array<{
        url: string;
        type: "IMAGE" | "VIDEO";
        durationSeconds?: number | null;
      }>;
    },
  ) => apiClient.patch<Review>(`${API.reviews.create}/${reviewId}`, body),
  /** The author deletes their review (permanently). */
  remove: (reviewId: string) =>
    apiClient.delete<{ deleted: boolean }>(`${API.reviews.create}/${reviewId}`),
  vote: (reviewId: string, vote: "HELPFUL" | "UNHELPFUL") =>
    apiClient.post<Review>(API.reviews.vote(reviewId), { vote }),
  approve: (id: string) => apiClient.patch<Review>(API.reviews.approve(id), {}),
  reject: (id: string) => apiClient.patch<Review>(API.reviews.reject(id), {}),
  pending: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<Review>> => {
    const res = await apiClient.getWithResponse<Review[]>(
      withQuery(API.reviews.moderation, params),
    );
    return unwrapPaginatedList(res);
  },
  respond: (id: string, body: { response: string }) =>
    apiClient.patch<Review>(API.reviews.respond(id), body),
};
