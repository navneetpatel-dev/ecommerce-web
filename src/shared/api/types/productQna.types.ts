import type {
  ProductQuestionStatus,
  ProductAnswerAuthorType,
} from "@/shared/constants/statuses";

export interface ProductAnswer {
  id: string;
  answer: string;
  authorType: ProductAnswerAuthorType;
  authorName: string | null;
  createdAt: string;
  /** The answer's author (lets them edit it). */
  authorId?: string;
  editedAt?: string | null;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  question: string;
  status: ProductQuestionStatus;
  createdAt: string;
  customerName: string | null;
  /** The asker (lets them edit it while unanswered). */
  userId?: string;
  editedAt?: string | null;
  /** Published answers in the thread; `answers` holds only the best one(s). */
  answerCount?: number;
  productName?: string | null;
  answers: ProductAnswer[];
}
