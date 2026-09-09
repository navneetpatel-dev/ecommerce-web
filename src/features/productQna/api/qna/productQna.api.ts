import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { ProductQuestion, ProductAnswer } from "@/shared/api/types";

export const productQnaApi = {
  forProduct: async (
    productId: string,
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductQuestion>> => {
    const res = await apiClient.getWithResponse<ProductQuestion[]>(
      withQuery(API.productQna.forProduct(productId), params),
    );
    return unwrapPaginatedList(res);
  },
  forVendorMe: () => apiClient.get<ProductQuestion[]>(API.productQna.vendorMe),
  ask: (body: { productId: string; question: string }) =>
    apiClient.post<ProductQuestion>(API.productQna.ask, body),
  answer: (questionId: string, body: { answer: string }) =>
    apiClient.post<ProductAnswer>(API.productQna.answer(questionId), body),
  moderate: (questionId: string, body: { status: "PUBLISHED" | "REJECTED" }) =>
    apiClient.patch<ProductQuestion>(API.productQna.moderate(questionId), body),
  pending: async (
    params: PaginationQuery = {},
  ): Promise<PaginatedList<ProductQuestion>> => {
    const res = await apiClient.getWithResponse<ProductQuestion[]>(
      withQuery(API.productQna.moderation, params),
    );
    return unwrapPaginatedList(res);
  },
};
