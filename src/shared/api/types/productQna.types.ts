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
}

export interface ProductQuestion {
  id: string;
  productId: string;
  question: string;
  status: ProductQuestionStatus;
  createdAt: string;
  customerName: string | null;
  productName?: string | null;
  answers: ProductAnswer[];
}
