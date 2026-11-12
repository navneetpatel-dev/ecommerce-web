import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface AnswerQuestionFormProps {
  questionId: string;
  draft: string;
  isPending: boolean;
  error: string | null;
  onDraftChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

/** A buyer's or the seller's answer to one question (C-01). */
export function AnswerQuestionForm({
  questionId,
  draft,
  isPending,
  error,
  onDraftChange,
  onSubmit,
  onCancel,
}: AnswerQuestionFormProps) {
  const fieldId = `answer-${questionId}`;
  return (
    <form onSubmit={onSubmit} className={styles.answerForm}>
      <label htmlFor={fieldId} className={styles.answerAuthor}>
        {LABELS.yourAnswer}
      </label>
      <Textarea
        id={fieldId}
        value={draft}
        onChange={onDraftChange}
        rows={3}
        maxLength={2000}
        required
      />
      <FormError error={error} fallback={LABELS.couldNotSubmitAnswer} />
      <div className={styles.answerFormButtons}>
        <Button
          type="submit"
          size="sm"
          loading={isPending}
          disabled={!draft.trim()}
        >
          {LABELS.submitAnswer}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          {LABELS.cancel}
        </Button>
      </div>
    </form>
  );
}
