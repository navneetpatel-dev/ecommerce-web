import { apiClient } from "@/shared/api/client/client";
import {
  unwrapPaginatedList,
  withQuery,
  type PaginatedList,
  type PaginationQuery,
} from "@/shared/api/client/pagination";
import { API } from "@/shared/constants/apiRoutes";
import type { ProductQuestion, ProductAnswer } from "@/shared/api/types";
import type {
  MyAnswer,
  MyQuestion,
  ProductQuestionPage,
  ProductQuestionsParams,
} from "../../types/productQna.types";
import { readQnaSummary } from "../../utils/productQna.utils";

export const productQnaApi = {
  /** One filtered page of a product's questions + the answered summary. */
  forProduct: async (
    productId: string,
    params: ProductQuestionsParams = {},
  ): Promise<ProductQuestionPage> => {
    const res = await apiClient.getWithResponse<ProductQuestion[]>(
      withQuery(API.productQna.forProduct(productId), { ...params }),
    );
    return {
      ...unwrapPaginatedList(res),
      summary: readQnaSummary(res.meta?.summary),
    };
  },
  forVendorMe: () => apiClient.get<ProductQuestion[]>(API.productQna.vendorMe),
  ask: (body: { productId: string; question: string }) =>
    apiClient.post<ProductQuestion>(API.productQna.ask, body),
  /** C-01: only the seller or a shopper who received the product may answer. */
  canAnswer: (productId: string) =>
    apiClient.get<{ canAnswer: boolean }>(API.productQna.canAnswer(productId)),
  /** One page of a question's published answers (seller first, then oldest). */
  answers: async (
    questionId: string,
    params: PaginationQuery,
  ): Promise<PaginatedList<ProductAnswer>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<ProductAnswer[]>(
        withQuery(API.productQna.answer(questionId), params),
      ),
    ),
  /** The shopper's own questions / answers, newest first. */
  myQuestions: async (
    page = 1,
    limit = 12,
  ): Promise<PaginatedList<MyQuestion>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<MyQuestion[]>(
        withQuery(API.productQna.myQuestions, { page, limit }),
      ),
    ),
  myAnswers: async (page = 1, limit = 12): Promise<PaginatedList<MyAnswer>> =>
    unwrapPaginatedList(
      await apiClient.getWithResponse<MyAnswer[]>(
        withQuery(API.productQna.myAnswers, { page, limit }),
      ),
    ),
  updateQuestion: (questionId: string, body: { question: string }) =>
    apiClient.patch<ProductQuestion>(
      API.productQna.updateQuestion(questionId),
      body,
    ),
  updateAnswer: (answerId: string, body: { answer: string }) =>
    apiClient.patch<ProductAnswer>(API.productQna.updateAnswer(answerId), body),
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
