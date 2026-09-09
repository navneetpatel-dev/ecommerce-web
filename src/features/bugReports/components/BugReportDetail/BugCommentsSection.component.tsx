import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Textarea } from "@/shared/components/ui/textarea";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import { formatLabel } from "@/shared/utils/formatLabel";
import { BUG_COMMENT_MAX } from "../../constants/fieldLimits";
import type { BugComment } from "../../api/bugReports.api";
import { bugReportPanelsStyles } from "./bugReportPanels.styles";

function commentInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

interface BugCommentsSectionProps {
  comments: BugComment[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  comment: string;
  onCommentChange: (value: string) => void;
  addPending: boolean;
  error: string | null;
  onAdd: () => void;
}

/** Internal admin comments thread with add-comment composer. */
export function BugCommentsSection(props: BugCommentsSectionProps) {
  return (
    <section className={bugReportPanelsStyles.panelRoot}>
      <div className={bugReportPanelsStyles.panelHeader}>
        <TextEyebrow brand>{LABELS.bugInternalComments}</TextEyebrow>
        <p className={bugReportPanelsStyles.panelSubtitle}>
          {LABELS.bugInternalCommentsHint}
        </p>
      </div>

      <div className={bugReportPanelsStyles.panelBodyPadded}>
        {props.comments.length === 0 ? (
          <p className={bugReportPanelsStyles.commentsEmpty}>
            {LABELS.bugNoCommentsYet}
          </p>
        ) : (
          <ul className={bugReportPanelsStyles.commentsList}>
            {props.comments.map((c) => {
              const name = c.authorName || LABELS.ticketMessageSupport;
              return (
                <li key={c.id} className={bugReportPanelsStyles.commentItem}>
                  <Avatar className={bugReportPanelsStyles.commentAvatar}>
                    <AvatarFallback
                      className={bugReportPanelsStyles.commentFallback}
                    >
                      {commentInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={bugReportPanelsStyles.commentBubble}>
                    <div className={bugReportPanelsStyles.commentMeta}>
                      <span className={bugReportPanelsStyles.commentAuthor}>
                        {name}
                      </span>
                      <span className={bugReportPanelsStyles.commentTime}>
                        {formatOrderDate(c.createdAt)}
                      </span>
                    </div>
                    <p className={bugReportPanelsStyles.commentText}>
                      {c.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {props.hasNextPage ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={props.isFetchingNextPage}
            onClick={props.onLoadMore}
          >
            {LABELS.loadMore}
          </Button>
        ) : null}
      </div>

      <div className={bugReportPanelsStyles.commentComposer}>
        <FormFieldFrame label={LABELS.bugAddComment}>
          <Textarea
            value={props.comment}
            onChange={(e) =>
              props.onCommentChange(e.target.value.slice(0, BUG_COMMENT_MAX))
            }
            placeholder={LABELS.bugCommentPlaceholder}
            rows={3}
            className={bugReportPanelsStyles.commentTextarea}
            maxLength={BUG_COMMENT_MAX}
          />
          <p className={bugReportPanelsStyles.commentCounter}>
            {formatLabel(LABELS.ticketCharCounter, {
              count: props.comment.length,
              max: BUG_COMMENT_MAX,
            })}
          </p>
        </FormFieldFrame>
        <FormError
          error={props.error ? new Error(props.error) : null}
          fallback={LABELS.bugCouldNotComment}
        />
        <div className={bugReportPanelsStyles.commentActions}>
          <Button
            type="button"
            loading={props.addPending}
            disabled={!props.comment.trim()}
            onClick={props.onAdd}
          >
            {LABELS.bugAddComment}
          </Button>
        </div>
      </div>
    </section>
  );
}
