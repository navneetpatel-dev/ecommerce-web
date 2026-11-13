"use client";

import { useId } from "react";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_QUESTION_STATUS } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import type { ProductQuestion } from "@/shared/api/types";
import { answerCountLabel } from "../../utils/productQna.utils";
import { useAnswerThread } from "../../hooks/list/useAnswerThread.hook";
import { useQnaEditActions } from "../../context/qnaEdit.context";
import { AnswerList } from "./AnswerList.component";
import { AnswerThreadControls } from "./AnswerThreadControls.component";
import { OwnerEditButton } from "./OwnerEditButton.component";
import {
  QuestionAnswerSlot,
  type AnsweringState,
} from "./QuestionAnswerSlot.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/** "Q" + the question, its best answer (thread on demand) and the Answer action. */
export function QuestionItem({
  question: q,
  answering,
}: {
  question: ProductQuestion;
  answering?: AnsweringState;
}) {
  const answersId = useId();
  const thread = useAnswerThread(q);
  const { currentUserId, editQuestion } = useQnaEditActions();
  // Editable by the asker only while nobody has answered (answers would lose their context).
  const canEdit = Boolean(
    currentUserId && q.userId === currentUserId && thread.total === 0,
  );
  const handleEdit = () => editQuestion(q);

  return (
    <article className={styles.questionArticle}>
      <div className={styles.questionRow}>
        <span className={styles.qBadge} aria-hidden>
          {LABELS.questionLabel}
        </span>
        <div className={styles.questionBody}>
          <p className={styles.questionText}>{q.question}</p>
          <p className={styles.questionMeta}>
            <span>{q.customerName ?? LABELS.verifiedCustomer}</span>
            <span aria-hidden>·</span>
            <time dateTime={q.createdAt}>{formatOrderDate(q.createdAt)}</time>
            {thread.total ? (
              <>
                <span aria-hidden>·</span>
                <span className={styles.answerCount}>
                  {answerCountLabel(thread.total)}
                </span>
              </>
            ) : null}
            {q.editedAt ? (
              <span className={styles.editedTag}>{LABELS.editedTag}</span>
            ) : null}
            {q.status === PRODUCT_QUESTION_STATUS.PENDING ? (
              <span className={styles.pendingTag}>
                {LABELS.questionPendingReview}
              </span>
            ) : null}
            {canEdit ? (
              <OwnerEditButton
                label={LABELS.editQuestionAria}
                onClick={handleEdit}
              />
            ) : null}
          </p>
          {thread.visible.length ? (
            <AnswerList id={answersId} answers={thread.visible} />
          ) : null}
        </div>
      </div>
      {thread.isLoadingThread ? (
        <div className={styles.threadLoading}>
          <ReviewListSkeleton count={2} />
        </div>
      ) : null}
      <AnswerThreadControls thread={thread} controlsId={answersId} />
      {thread.total ? null : (
        <p className={styles.noAnswersText}>{LABELS.noAnswersYet}</p>
      )}
      <QuestionAnswerSlot question={q} answering={answering} />
    </article>
  );
}
