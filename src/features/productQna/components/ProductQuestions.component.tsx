import { MessageCircleQuestion, Store, User } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { LABELS } from "@/shared/constants/labels";
import { PRODUCT_ANSWER_AUTHOR_TYPE } from "@/shared/constants/statuses";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { ProductQuestion } from "@/shared/api/types";

interface ProductQuestionsProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
}

export function ProductQuestions({
  questions,
  isLoading,
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
        className="px-0 py-8"
      />
    );
  }

  return (
    <div className="max-w-[65ch] divide-y divide-line">
      {questions.map((q) => (
        <article key={q.id} className="py-6 first:pt-0">
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" />
            <div>
              <p className="text-body leading-relaxed text-ink whitespace-pre-wrap">
                {q.question}
              </p>
              <p className="mt-1 text-body-sm text-ink-muted">
                {q.customerName ?? LABELS.verifiedCustomer} ·{" "}
                {formatOrderDate(q.createdAt)}
              </p>
            </div>
          </div>

          {q.answers.length > 0 ? (
            <div className="mt-4 space-y-3">
              {q.answers.map((a) => (
                <div key={a.id} className="ml-6 border-l-2 border-line pl-4">
                  <p className="flex items-center gap-1.5 text-body-sm font-medium text-ink">
                    {a.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR ? (
                      <Store className="h-3.5 w-3.5" />
                    ) : (
                      <User className="h-3.5 w-3.5" />
                    )}
                    {a.authorType === PRODUCT_ANSWER_AUTHOR_TYPE.VENDOR
                      ? LABELS.sellerAnswer
                      : (a.authorName ?? LABELS.verifiedCustomer)}
                    <span className="font-normal text-ink-muted">
                      {formatOrderDate(a.createdAt)}
                    </span>
                  </p>
                  <p className="mt-1 text-body-sm leading-relaxed text-ink-muted whitespace-pre-wrap">
                    {a.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="ml-6 mt-3 text-body-sm text-ink-muted">
              {LABELS.noAnswersYet}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
