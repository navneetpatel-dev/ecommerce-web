import type {
  ProductQuestionStatus,
  ProductAnswerAuthorType,
} from "@/shared/constants/statuses";

/** Author only: their edit of published text, waiting for approval, or when one was declined. */
export interface UgcRevisionFields<K extends string> {
  pendingRevision?: ({ submittedAt: string } & Record<K, string>) | null;
  revisionRejectedAt?: string | null;
}

export interface ProductAnswer extends UgcRevisionFields<"answer"> {
  id: string;
  answer: string;
  authorType: ProductAnswerAuthorType;
  authorName: string | null;
  createdAt: string;
  /** The answer's author (lets them edit it). */
  authorId?: string;
  editedAt?: string | null;
  /** Present on the viewer's own answer (it can still be awaiting approval). */
  status?: "PENDING" | "PUBLISHED" | "REJECTED";
}

export interface ProductQuestion extends UgcRevisionFields<"question"> {
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
  /** The viewer's own answer on this question (any status): pinned first, editable. */
  myAnswer?: ProductAnswer | null;
  productName?: string | null;
  answers: ProductAnswer[];
}
