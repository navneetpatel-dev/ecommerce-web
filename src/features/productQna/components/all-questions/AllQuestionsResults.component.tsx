import { SearchX } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { PaginationResultSummary } from "@/shared/components/navigation/PaginationResultSummary.component";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { ProductQuestion } from "@/shared/api/types";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";
import { QuestionList } from "../list/QuestionList.component";
import type { AnsweringState } from "../list/QuestionAnswerSlot.component";
import { productQnaStyles } from "../../styles/list/productQna.styles";

interface AllQuestionsResultsProps {
  questions: ProductQuestion[];
  answering?: AnsweringState;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
}

export function AllQuestionsResults(props: AllQuestionsResultsProps) {
  if (props.isLoading) return <ReviewListSkeleton count={4} />;

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

  return (
    <div className={styles.results}>
      <div className={styles.resultRow}>
        <PaginationResultSummary
          from={props.from}
          to={props.to}
          total={props.total}
          className={styles.resultText}
        />
        {props.hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            className={styles.clearButton}
            onClick={props.onClearFilters}
          >
            {LABELS.resetListFilters}
          </Button>
        ) : null}
      </div>
      {props.questions.length ? (
        <div className={cn(props.isFetching && styles.resultsFetching)}>
          <QuestionList
            questions={props.questions}
            answering={props.answering}
          />
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          heading={
            props.hasFilters ? LABELS.noQuestionsMatch : LABELS.noQuestionsYet
          }
          message={
            props.hasFilters
              ? LABELS.noQuestionsMatchHint
              : LABELS.beFirstToAskQuestion
          }
          actionLabel={props.hasFilters ? LABELS.resetListFilters : undefined}
          onAction={props.hasFilters ? props.onClearFilters : undefined}
          className={productQnaStyles.emptyState}
        />
      )}
      {props.totalPages > 1 ? (
        <div className={styles.pagination}>
          <PaginationContainer
            currentPage={props.page}
            totalPages={props.totalPages}
            onPageChange={props.onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
