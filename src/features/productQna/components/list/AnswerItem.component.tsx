"use client";

import { LABELS } from "@/shared/constants/labels";
import {
  PRODUCT_ANSWER_AUTHOR_TYPE,
  PRODUCT_ANSWER_STATUS,
} from "@/shared/constants/statuses";
import type { ProductAnswer } from "@/shared/api/types";
import { ExpandableText } from "@/shared/components/display/ExpandableText.component";
import { ANSWER_CLAMP_CHARS } from "../../constants/productQna.constants";
import { useQnaEditActions } from "../../context/qnaEdit.context";
import { OwnerActions } from "@/shared/components/actions/OwnerActions.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";
import { AnswerByline } from "./AnswerByline.component";

/**
 * "A" + the answer, then who answered (seller tag or verified buyer) and when.
 * The viewer's own answer gets a header strip — "Your answer · Awaiting
 * approval" on the left, Edit / Delete on the right — so the byline stays short.
 */
export function AnswerItem({
  answer,
  pinned = false,
}: {
  answer: ProductAnswer;
  /** The viewer's own answer, shown first with its moderation state. */
  pinned?: boolean;
}) {
  const isSeller = answer.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR;
  const { currentUserId, editAnswer, deleteAnswer } = useQnaEditActions();
  const isMine = Boolean(currentUserId && answer.authorId === currentUserId);
  const handleEdit = () => editAnswer(answer);
  const handleDelete = () => deleteAnswer(answer);
  const ownerActions = isMine ? (
    <OwnerActions
      compact
      onEdit={handleEdit}
      onDelete={handleDelete}
      editLabel={LABELS.editAnswerAria}
      deleteLabel={LABELS.deleteAnswerAria}
    />
  ) : null;

  const badge = (
    <span className={pinned ? styles.aBadgeInline : styles.aBadge} aria-hidden>
      {LABELS.answerLabel}
    </span>
  );
  const byline = (
    <AnswerByline answer={answer} isSeller={isSeller}>
      {pinned ? null : ownerActions}
    </AnswerByline>
  );
  const body = (
    <ExpandableText
      text={answer.answer}
      threshold={ANSWER_CLAMP_CHARS}
      className={styles.answerBody}
    />
  );

  if (pinned) {
    // Header strip: "A · Your answer · Awaiting approval" left, Edit / Delete
    // right; the text below gets the card's full width (matters on phones).
    return (
      <div data-answer-id={answer.id} className={styles.mineAnswer}>
        <div className={styles.answerStatusRow}>
          <div className={styles.answerTags}>
            {badge}
            <span className={styles.mineTag}>{LABELS.yourAnswerTag}</span>
            {answer.status === PRODUCT_ANSWER_STATUS.PENDING ? (
              <span className={styles.pendingTag}>
                {LABELS.pendingReviewTag}
              </span>
            ) : null}
          </div>
          {ownerActions}
        </div>
        {body}
        {byline}
      </div>
    );
  }

  return (
    <div data-answer-id={answer.id} className={styles.answerItem}>
      {badge}
      <div className={styles.answerContent}>
        {body}
        {byline}
      </div>
    </div>
  );
}
