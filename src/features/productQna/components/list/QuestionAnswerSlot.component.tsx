import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_QUESTION_STATUS } from "@/shared/constants/statuses";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { ProductQuestion } from "@/shared/api/types";
import { AnswerQuestionForm } from "./AnswerQuestionForm.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

export interface AnsweringState {
  /**
   * answer: may answer (seller, or received the product — C-01);
   * signedOut: Answer opens the sign-in prompt; notBuyer: no Answer (one note above the list).
   */
  mode: "answer" | "signedOut" | "notBuyer";
  onSignIn: () => void;
  openId: string | null;
  submittedId: string | null;
  draft: string;
  isPending: boolean;
  error: string | null;
  onToggle: (questionId: string) => void;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/** The Answer button, its form, or the "waiting for review" note under one question. */
export function QuestionAnswerSlot({
  question,
  answering,
  ownQuestion = false,
}: {
  question: ProductQuestion;
  answering?: AnsweringState;
  /** The viewer asked this: answering your own question is not offered. */
  ownQuestion?: boolean;
}) {
  // Already answered (edit it on the pinned answer), not answerable, or not published yet.
  if (
    !answering ||
    question.myAnswer ||
    ownQuestion ||
    answering.mode === "notBuyer" ||
    question.status !== PRODUCT_QUESTION_STATUS.PUBLISHED
  ) {
    return null;
  }
  const handleToggle =
    answering.mode === "signedOut"
      ? answering.onSignIn
      : () => answering.onToggle(question.id);

  if (answering.submittedId === question.id) {
    return (
      <p role="status" className={styles.answerSubmitted}>
        {LABELS.answerSubmitted}
      </p>
    );
  }
  if (answering.openId === question.id) {
    return (
      <AnswerQuestionForm
        questionId={question.id}
        draft={answering.draft}
        isPending={answering.isPending}
        error={answering.error}
        onDraftChange={answering.onDraftChange}
        onSubmit={answering.onSubmit}
        onCancel={handleToggle}
      />
    );
  }
  return (
    <div className={styles.answerActions}>
      <Button
        type="button"
        size="sm"
        variant="outline"
        aria-label={formatLabel(LABELS.answerQuestionFor, {
          question: question.question,
        })}
        onClick={handleToggle}
        className={styles.answerButton}
      >
        {LABELS.answerQuestion}
      </Button>
    </div>
  );
}
