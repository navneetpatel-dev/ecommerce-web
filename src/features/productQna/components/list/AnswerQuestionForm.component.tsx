import type { ChangeEvent, FormEvent } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormError } from "@/shared/components/forms/FormError.component";
import { LABELS } from "@/shared/constants/labels";
import { UGC_LIMITS } from "@/shared/constants/ugc/ugcLimits";
import { isUgcTextValid } from "@/shared/schemas/ugcText.schema";
import { CharacterCount } from "@/shared/components/forms/CharacterCount.component";
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
  const countId = `${fieldId}-count`;
  return (
    <form onSubmit={onSubmit} className={styles.answerForm}>
      <label htmlFor={fieldId} className={styles.answerFormLabel}>
        {LABELS.yourAnswer}
      </label>
      <Textarea
        id={fieldId}
        value={draft}
        onChange={onDraftChange}
        rows={3}
        maxLength={UGC_LIMITS.answer.max}
        aria-describedby={countId}
        required
      />
      <CharacterCount id={countId} value={draft} limits={UGC_LIMITS.answer} />
      <FormError error={error} fallback={LABELS.couldNotSubmitAnswer} />
      <div className={styles.answerFormButtons}>
        <Button
          type="submit"
          size="sm"
          loading={isPending}
          disabled={!isUgcTextValid(draft, UGC_LIMITS.answer)}
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
