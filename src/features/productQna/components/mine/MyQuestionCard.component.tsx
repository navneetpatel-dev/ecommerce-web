"use client";

import Link from "next/link";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { useQnaEditActions } from "../../context/qnaEdit.context";
import { answerCountLabel } from "../../utils/productQna.utils";
import type { MyQuestion } from "../../types/productQna.types";
import { MyQnaStatusBadge } from "./MyQnaStatusBadge.component";
import { myQnaPagesStyles as styles } from "../../styles/mine/myQnaPages.styles";

export function MyQuestionCard({ question }: { question: MyQuestion }) {
  const { editQuestion, deleteQuestion } = useQnaEditActions();
  const answers = question.answerCount ?? 0;
  // Editable only while unanswered — answers would lose their context.
  const canEdit = answers === 0;
  const handleEdit = () => editQuestion(question);
  const handleDelete = () => deleteQuestion(question);

  return (
    <li className={styles.item}>
      <div className={styles.itemHeader}>
        {question.product ? (
          <Link
            href={PATHS.productQuestions(question.product.slug)}
            className={styles.productLink}
          >
            {question.product.name}
          </Link>
        ) : (
          <span className={styles.productFallback}>{LABELS.product}</span>
        )}
        <div className={styles.actions}>
          <MyQnaStatusBadge status={question.status} />
          <OwnerActions
            onEdit={canEdit ? handleEdit : undefined}
            onDelete={handleDelete}
            editLabel={LABELS.editQuestionAria}
            deleteLabel={LABELS.deleteQuestionAria}
          />
        </div>
      </div>
      <p className={styles.questionText}>{question.question}</p>
      <p className={styles.meta}>
        <time dateTime={question.createdAt}>
          {formatOrderDate(question.createdAt)}
        </time>
        <span aria-hidden>·</span>
        <span>{answers ? answerCountLabel(answers) : LABELS.noAnswersYet}</span>
        {question.editedAt ? (
          <span className={styles.editedTag}>{LABELS.editedTag}</span>
        ) : null}
      </p>
    </li>
  );
}
