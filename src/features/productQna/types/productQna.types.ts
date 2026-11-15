import type { PaginatedList } from "@/shared/api/client/pagination";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";

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

/** A question on "My questions", with the product it was asked on. */
export interface MyQuestion extends ProductQuestion {
  product: { id: string; name: string; slug: string } | null;
}

/** An answer on "My answers", with its question and product. */
export interface MyAnswer extends ProductAnswer {
  question: {
    id: string;
    question: string;
    product: { id: string; name: string; slug: string } | null;
  } | null;
}

export type ProductQuestionPage = PaginatedList<ProductQuestion> & {
  summary: QnaSummary;
};

/** One row of the Q&A moderation queue (a new post, or an edit of a published one). */
export interface QnaModerationItem {
  id: string;
  kind: "QUESTION" | "ANSWER";
  submission: "NEW" | "EDIT";
  /** The text approving would publish. */
  text: string;
  /** For an edit: what shoppers see now. */
  previousText: string | null;
  /** For an answer: the question it answers. */
  questionText: string | null;
  productName: string | null;
  authorName: string | null;
  authorType?: "VENDOR" | "CUSTOMER";
  vendorName?: string | null;
  submittedAt: string;
}
