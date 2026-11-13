import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { AnswerThreadState } from "../../hooks/list/useAnswerThread.hook";
import { productQnaStyles as styles } from "../../styles/list/productQna.styles";

interface AnswerThreadControlsProps {
  thread: AnswerThreadState;
  controlsId: string;
}

/**
 * Collapsed: one "See 54 more answers" button. Open: a footer with how far the
 * reader is ("Showing 40 of 72 answers" + bar) beside equal-size Load more /
 * Show fewer buttons; on phones the buttons share the row.
 */
export function AnswerThreadControls({
  thread,
  controlsId,
}: AnswerThreadControlsProps) {
  if (!thread.hiddenCount) return null;

  if (!thread.expanded) {
    return (
      <div className={styles.threadControls}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-expanded={false}
          aria-controls={controlsId}
          onClick={thread.toggle}
          className={styles.threadButton}
        >
          {thread.expandLabel}
          <ChevronDown aria-hidden />
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.threadFooter}>
      <div className={styles.threadProgressBlock}>
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
        ) : (
          <>
            <p role="status" className={styles.threadProgress}>
              {thread.progressLabel}
            </p>
            <span className={styles.threadProgressTrack} aria-hidden>
              <span
                className={styles.threadProgressFill}
                style={{ width: `${thread.progressPercent}%` }}
              />
            </span>
          </>
        )}
      </div>
      <div
        className={
          thread.hasMore ? styles.threadActions : styles.threadActionsSingle
        }
      >
        {thread.hasMore ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={thread.isLoadingMore}
            onClick={thread.loadMore}
            className={styles.threadButton}
          >
            {LABELS.loadMoreAnswers}
            <ChevronDown aria-hidden />
          </Button>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-expanded
          aria-controls={controlsId}
          onClick={thread.toggle}
          className={styles.threadButtonQuiet}
        >
          {LABELS.showFewerAnswers}
          <ChevronUp aria-hidden />
        </Button>
      </div>
    </div>
  );
}
