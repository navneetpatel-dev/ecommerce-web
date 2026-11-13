import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import type { QnaSummary } from "../../types/productQna.types";
import { QnaSummaryCard } from "./QnaSummaryCard.component";
import { QuestionList } from "./QuestionList.component";
import type { AnsweringState } from "./QuestionAnswerSlot.component";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface ProductQuestionsProps {
  questions: ProductQuestion[];
  summary: QnaSummary;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  /** Present when the viewer may answer (C-01). */
  answering?: AnsweringState;
  askSlot: ReactNode;
  allQuestionsHref: string;
  viewAllLabel: string;
  hasMore: boolean;
}

function QuestionsBody(props: ProductQuestionsProps) {
  if (props.isLoading) return <ReviewListSkeleton count={3} />;
  if (props.isError) {
    return (
      <ErrorState
        size="section"
        heading={LABELS.questionsLoadFailed}
        message={LABELS.reviewsLoadFailedHint}
        onRetry={props.onRetry}
      />
    );
  }
  if (!props.questions.length) {
    return (
      <EmptyState
        heading={LABELS.noQuestionsYet}
        message={LABELS.beFirstToAskQuestion}
        icon={MessageCircleQuestion}
        className={styles.emptyState}
      />
    );
  }
  return (
    <>
      <QuestionList questions={props.questions} answering={props.answering} />
      {props.hasMore ? (
        <div className={styles.viewAllRow}>
          <Button asChild variant="outline" className={styles.viewAllButton}>
            <Link href={props.allQuestionsHref}>
              {props.viewAllLabel}
              <ArrowRight className={styles.viewAllIcon} aria-hidden />
            </Link>
          </Button>
        </div>
      ) : null}
    </>
  );
}

/** PDP Q&A: summary + ask form beside the best-answered questions, then "View all". */
export function ProductQuestions(props: ProductQuestionsProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <div className={styles.asideSticky}>
          {props.summary.total ? (
            <QnaSummaryCard summary={props.summary} />
          ) : null}
          {props.askSlot}
        </div>
      </aside>
      <div className={styles.main}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>{LABELS.topQuestions}</h3>
        </div>
        <QuestionsBody {...props} />
      </div>
    </div>
  );
}
