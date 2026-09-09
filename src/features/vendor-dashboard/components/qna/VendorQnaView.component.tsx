"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { VendorQnaAnswerDialog } from "./VendorQnaAnswerDialog.component";
import { vendorFeedbackViewsStyles } from "../reviews/vendorFeedbackViews.styles";

interface VendorQnaViewProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onAnswer: (questionId: string, answer: string) => void | Promise<void>;
}

export function VendorQnaView({
  questions,
  isLoading = false,
  loadError = null,
  submitting = false,
  onAnswer,
}: VendorQnaViewProps) {
  const [targetId, setTargetId] = useState<string | null>(null);

  return (
    <section className={vendorFeedbackViewsStyles.section}>
      <div className={vendorFeedbackViewsStyles.header}>
        <div className={vendorFeedbackViewsStyles.headerInfo}>
          <h1 className={vendorFeedbackViewsStyles.title}>
            {LABELS.questionsAndAnswers}
          </h1>
          <p className={vendorFeedbackViewsStyles.hint}>
            {LABELS.vendorQnaHint}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div
          className={vendorFeedbackViewsStyles.loadingStack}
          aria-busy="true"
          aria-live="polite"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className={vendorFeedbackViewsStyles.skeleton}
            />
          ))}
        </div>
      ) : loadError ? (
        <p className={vendorFeedbackViewsStyles.errorBox}>{loadError}</p>
      ) : null}

      {!isLoading && !loadError
        ? questions.map((question) => (
            <article
              key={question.id}
              className={vendorFeedbackViewsStyles.card}
            >
              {question.productName ? (
                <p className={vendorFeedbackViewsStyles.cardSubtitle}>
                  {question.productName}
                </p>
              ) : null}
              <p className={vendorFeedbackViewsStyles.cardTitle}>
                {question.question}
              </p>
              <Button
                className={vendorFeedbackViewsStyles.actionBtn}
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => setTargetId(question.id)}
              >
                {LABELS.answerQuestion}
              </Button>
            </article>
          ))
        : null}

      {!isLoading && !loadError && !questions.length ? (
        <p className={vendorFeedbackViewsStyles.emptyText}>
          {LABELS.noQuestionsFound}
        </p>
      ) : null}

      <VendorQnaAnswerDialog
        open={Boolean(targetId)}
        submitting={submitting}
        onOpenChange={(open) => {
          if (!open) setTargetId(null);
        }}
        onSubmit={(answer) => {
          if (!targetId) return;
          void Promise.resolve(onAnswer(targetId, answer)).then(() =>
            setTargetId(null),
          );
        }}
      />
    </section>
  );
}
