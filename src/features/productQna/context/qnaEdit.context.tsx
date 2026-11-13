"use client";

import { createContext, useContext } from "react";
import type { ProductAnswer, ProductQuestion } from "@/shared/api/types";

export interface QnaEditActions {
  /** Signed-in shopper, to show "Edit" on their own posts only. */
  currentUserId: string | null;
  editQuestion: (question: ProductQuestion) => void;
  editAnswer: (answer: ProductAnswer) => void;
  /** Deleting a question removes its answers too. */
  deleteQuestion: (question: ProductQuestion) => void;
  deleteAnswer: (answer: ProductAnswer) => void;
}

const NO_EDITING: QnaEditActions = {
  currentUserId: null,
  editQuestion: () => undefined,
  editAnswer: () => undefined,
  deleteQuestion: () => undefined,
  deleteAnswer: () => undefined,
};

export const QnaEditContext = createContext<QnaEditActions>(NO_EDITING);

/** Owner edit actions for Q&A rows (no-ops outside a `QnaEditProvider`). */
export function useQnaEditActions(): QnaEditActions {
  return useContext(QnaEditContext);
}
