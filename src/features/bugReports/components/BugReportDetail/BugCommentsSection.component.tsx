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
    <section className="overflow-hidden border border-line bg-surface shadow-elevation-1">
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.bugInternalComments}</TextEyebrow>
        <p className="mt-1 text-body-sm text-ink-muted">
          {LABELS.bugInternalCommentsHint}
        </p>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        {props.comments.length === 0 ? (
          <p className="border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted">
            {LABELS.bugNoCommentsYet}
          </p>
        ) : (
          <ul className="space-y-4">
            {props.comments.map((c) => {
              const name = c.authorName || LABELS.ticketMessageSupport;
              return (
                <li key={c.id} className="flex gap-3">
                  <Avatar className="mt-0.5 h-9 w-9 shrink-0 border border-line">
                    <AvatarFallback className="bg-paper text-[0.75rem] font-semibold text-ink-muted">
                      {commentInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 rounded-xl rounded-tl-md border border-line bg-surface-raised px-3.5 py-2.5 shadow-card-hairline">
                    <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="text-body-sm font-semibold text-ink">
                        {name}
                      </span>
                      <span className="text-[0.6875rem] text-ink-muted">
                        {formatOrderDate(c.createdAt)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-body leading-relaxed text-ink">
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

      <div className="space-y-3 border-t border-line bg-paper/30 px-4 py-4 sm:px-5">
        <FormFieldFrame label={LABELS.bugAddComment}>
          <Textarea
            value={props.comment}
            onChange={(e) =>
              props.onCommentChange(e.target.value.slice(0, BUG_COMMENT_MAX))
            }
            placeholder={LABELS.bugCommentPlaceholder}
            rows={3}
            className="min-h-[5rem] resize-y"
            maxLength={BUG_COMMENT_MAX}
          />
          <p className="mt-1 text-[0.75rem] tabular-nums text-ink-muted">
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
        <div className="flex justify-end">
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
