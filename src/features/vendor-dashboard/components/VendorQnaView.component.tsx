"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { VendorQnaAnswerDialog } from "./VendorQnaAnswerDialog.component";

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
    <section className="w-full min-w-0 space-y-6">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6">
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.questionsAndAnswers}
          </h1>
          <p className="max-w-3xl text-body leading-relaxed text-ink-muted">
            {LABELS.vendorQnaHint}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-[8.5rem] w-full rounded-md sm:h-[9.5rem]"
            />
          ))}
        </div>
      ) : loadError ? (
        <p className="border border-line bg-surface-raised px-5 py-10 text-center text-ink-muted">
          {loadError}
        </p>
      ) : null}

      {!isLoading && !loadError
        ? questions.map((question) => (
            <article
              key={question.id}
              className="w-full overflow-hidden rounded-md border border-line bg-surface p-4 shadow-card-hairline sm:p-6"
            >
              {question.productName ? (
                <p className="text-body-sm text-ink-muted">
                  {question.productName}
                </p>
              ) : null}
              <p className="mt-1 font-medium text-ink">{question.question}</p>
              <Button
                className="mt-4"
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
        <p className="text-ink-muted">{LABELS.noQuestionsFound}</p>
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
