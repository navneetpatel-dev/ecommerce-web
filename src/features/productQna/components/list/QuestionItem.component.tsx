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
import { AnswerItem } from "./AnswerItem.component";
import { AnswerThreadControls } from "./AnswerThreadControls.component";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { QUESTION_CLAMP_CHARS } from "../../constants/productQna.constants";
import {
  QuestionAnswerSlot,
  type AnsweringState,
} from "./QuestionAnswerSlot.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

/**
 * One question, laid out like a review: the question with its Edit / Delete on
 * the right, who asked and when beneath it, the answers on a quiet rail, and a
 * single footer row ("See 69 more answers" · "Answer").
 */
export function QuestionItem({
  question: q,
  answering,
}: {
  question: ProductQuestion;
  answering?: AnsweringState;
}) {
  const answersId = useId();
  const { thread, articleRef } = useAnswerThread(q);
  const { currentUserId, editQuestion, deleteQuestion } = useQnaEditActions();
  // Editable by the asker only while nobody has answered (answers would lose their context).
  const isMine = Boolean(currentUserId && q.userId === currentUserId);
  const canEdit = Boolean(
    currentUserId && q.userId === currentUserId && thread.total === 0,
  );
  const handleEdit = () => editQuestion(q);
  const handleDelete = () => deleteQuestion(q);
  const hasAnswersShown = Boolean(q.myAnswer || thread.visible.length);

  return (
    <article ref={articleRef} className={styles.questionArticle}>
      <div className={styles.questionRow}>
        <span className={styles.qBadge} aria-hidden>
          {LABELS.questionLabel}
        </span>
        <div className={styles.questionBody}>
          <div className={styles.questionHead}>
            <ExpandableText
              text={q.question}
              threshold={QUESTION_CLAMP_CHARS}
              className={styles.questionText}
            />
            {isMine ? (
              <OwnerActions
                compact
                onEdit={canEdit ? handleEdit : undefined}
                onDelete={handleDelete}
                editLabel={LABELS.editQuestionAria}
                deleteLabel={LABELS.deleteQuestionAria}
              />
            ) : null}
          </div>
          <div className={styles.questionMeta}>
            {isMine ? (
              <span className={styles.mineTag}>{LABELS.yourQuestionTag}</span>
            ) : null}
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
          </div>
          {hasAnswersShown ? (
            <div className={styles.answersRail}>
              {q.myAnswer ? <AnswerItem answer={q.myAnswer} pinned /> : null}
              {thread.visible.length ? (
                <AnswerList id={answersId} answers={thread.visible} />
              ) : null}
            </div>
          ) : null}
          {thread.isLoadingThread ? (
            <div className={styles.threadLoading}>
              <ReviewListSkeleton count={2} />
            </div>
          ) : null}
          {thread.total || q.myAnswer ? null : (
            <p className={styles.noAnswersText}>{LABELS.noAnswersYet}</p>
          )}
          <div className={styles.questionFooter}>
            <AnswerThreadControls thread={thread} controlsId={answersId} />
            <QuestionAnswerSlot
              question={q}
              answering={answering}
              ownQuestion={isMine}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
