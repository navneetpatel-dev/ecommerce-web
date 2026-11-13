import type { PaginatedList } from "@/shared/api/client/pagination";
import type { ProductQuestion } from "@/shared/api/types";

export type QuestionSort = "recent" | "oldest" | "most_answered";
export type AnsweredFilter = "all" | "answered" | "unanswered";

/** Over every published question of the product (filters never narrow it). */
export interface QnaSummary {
  total: number;
  answered: number;
}

export interface ProductQuestionsParams {
  page?: number;
  limit?: number;
  q?: string;
  answered?: AnsweredFilter;
  sort?: QuestionSort;
}

export type ProductQuestionPage = PaginatedList<ProductQuestion> & {
  summary: QnaSummary;
};
