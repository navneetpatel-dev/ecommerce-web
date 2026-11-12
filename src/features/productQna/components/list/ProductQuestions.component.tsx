import { MessageCircleQuestion } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { QuestionItem } from "./QuestionItem.component";
import type { AnsweringState } from "./QuestionAnswerSlot.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface ProductQuestionsProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
  /** Present when the viewer may answer (C-01). */
  answering?: AnsweringState;
}

export function ProductQuestions({
  questions,
  isLoading,
  answering,
}: ProductQuestionsProps) {
  if (isLoading) {
    return <ReviewListSkeleton count={3} />;
  }

  if (!questions.length) {
    return (
      <EmptyState
        heading={LABELS.noQuestionsYet}
        message={LABELS.beFirstToAskQuestion}
        icon={MessageCircleQuestion}
        maxWidth="max-w-[65ch]"
        className={styles.emptyState}
      />
    );
  }

  return (
    <div className={styles.questionsList}>
      {questions.map((q) => (
        <QuestionItem key={q.id} question={q} answering={answering} />
      ))}
    </div>
  );
}
