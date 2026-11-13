"use client";

import Link from "next/link";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import { useQnaEditActions } from "../../context/qnaEdit.context";
import { ANSWER_CLAMP_CHARS } from "../../constants/productQna.constants";
import type { MyAnswer } from "../../types/productQna.types";
import { MyQnaStatusBadge } from "./MyQnaStatusBadge.component";
import { myQnaPagesStyles as styles } from "../../styles/mine/myQnaPages.styles";

export function MyAnswerCard({ answer }: { answer: MyAnswer }) {
  const { editAnswer, deleteAnswer } = useQnaEditActions();
  const product = answer.question?.product ?? null;
  const handleEdit = () => editAnswer(answer);
  const handleDelete = () => deleteAnswer(answer);

  return (
    <li className={styles.item}>
      <div className={styles.itemHeader}>
        {product ? (
          <Link
            href={PATHS.productQuestions(product.slug)}
            className={styles.productLink}
          >
            {product.name}
          </Link>
        ) : (
          <span className={styles.productFallback}>{LABELS.product}</span>
        )}
        <div className={styles.actions}>
          <MyQnaStatusBadge status={answer.status} />
          <OwnerActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            editLabel={LABELS.editAnswerAria}
            deleteLabel={LABELS.deleteAnswerAria}
          />
        </div>
      </div>
      {answer.question ? (
        <p className={styles.quotedQuestion}>
          {formatLabel(LABELS.answeredQuestion, {
            question: answer.question.question,
          })}
        </p>
      ) : null}
      <ExpandableText
        text={answer.answer}
        threshold={ANSWER_CLAMP_CHARS}
        className={styles.answerBody}
      />
      <p className={styles.meta}>
        <time dateTime={answer.createdAt}>
          {formatOrderDate(answer.createdAt)}
        </time>
        {answer.editedAt ? (
          <span className={styles.editedTag}>{LABELS.editedTag}</span>
        ) : null}
      </p>
    </li>
  );
}
