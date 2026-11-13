import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { AnswerThreadState } from "../../hooks/list/useAnswerThread.hook";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface AnswerThreadControlsProps {
  thread: AnswerThreadState;
  controlsId: string;
}

/** "See 120,430 more answers" → then "Load more answers · 20 of 120,431" + "Show fewer". */
export function AnswerThreadControls({
  thread,
  controlsId,
}: AnswerThreadControlsProps) {
  if (!thread.hiddenCount) return null;

  if (!thread.expanded) {
    return (
      <div className={styles.threadControls}>
        <button
          type="button"
          aria-expanded={false}
          aria-controls={controlsId}
          onClick={thread.toggle}
          className={styles.moreAnswers}
        >
          {thread.expandLabel}
          <ChevronDown className={styles.moreAnswersIcon} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className={styles.threadControls}>
      {thread.isThreadError ? (
        <p role="alert" className={styles.threadError}>
          {LABELS.answersLoadFailed}{" "}
          <button
            type="button"
            onClick={thread.retry}
            className={styles.threadRetry}
          >
            {LABELS.retry}
          </button>
        </p>
      ) : null}
      {thread.hasMore ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={styles.loadMoreAnswers}
          loading={thread.isLoadingMore}
          onClick={thread.loadMore}
        >
          {LABELS.loadMoreAnswers}
        </Button>
      ) : null}
      {thread.hasMore ? (
        <span role="status" className={styles.threadProgress}>
          {thread.progressLabel}
        </span>
      ) : null}
      <button
        type="button"
        aria-expanded
        aria-controls={controlsId}
        onClick={thread.toggle}
        className={styles.moreAnswers}
      >
        {LABELS.showFewerAnswers}
        <ChevronUp className={styles.moreAnswersIcon} aria-hidden />
      </button>
    </div>
  );
}
