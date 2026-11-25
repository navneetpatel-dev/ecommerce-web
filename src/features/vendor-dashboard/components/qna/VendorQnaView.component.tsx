"use client";

import { useState, useMemo } from "react";
import { useDebouncedValue } from "@/shared/hooks/ui/use-debounce.hook";
import { LABELS } from "@/shared/constants/labels";
import type { ProductQuestion } from "@/shared/api/types";
import { FormFieldFrame } from "@/shared/components/forms";
import { SearchInput } from "@/shared/components/ui/SearchInput.component";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { VendorQnaAnswerDialog } from "./VendorQnaAnswerDialog.component";
import { VendorQnaList } from "./VendorQnaView/VendorQnaList.component";
import { VendorQnaSkeletonList } from "./VendorQnaView/VendorQnaSkeletonList.component";
import { useVendorQnaViewState } from "../../hooks/qna/useVendorQnaViewState.hook";
import { vendorFeedbackViewsStyles as styles } from "../../styles/reviews/vendorFeedbackViews.styles";

interface VendorQnaViewProps {
  questions: ProductQuestion[];
  isLoading?: boolean;
  loadError?: string | null;
  submitting?: boolean;
  onAnswer: (questionId: string, answer: string) => void | Promise<void>;
  onUpdateAnswer?: (answerId: string, answer: string) => void | Promise<void>;
}

export function VendorQnaView({
  questions,
  isLoading = false,
  loadError = null,
  submitting = false,
  onAnswer,
  onUpdateAnswer,
}: VendorQnaViewProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const {
    targetId,
    initialAnswer,
    handleOpenAnswer,
    handleAnswerOpenChange,
    handleAnswerSubmit,
  } = useVendorQnaViewState({ questions, onAnswer, onUpdateAnswer });

  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        const text = String(q.question ?? "").toLowerCase();
        const answersText = (q.answers ?? [])
          .map((a) => a.answer)
          .join(" ")
          .toLowerCase();
        const myAns = String(q.myAnswer?.answer ?? "").toLowerCase();
        const prod = String(q.productName ?? "").toLowerCase();
        if (
          !text.includes(query) &&
          !answersText.includes(query) &&
          !myAns.includes(query) &&
          !prod.includes(query)
        ) {
          return false;
        }
      }
      const hasAnswer = Boolean(
        (q.answers && q.answers.length > 0) || q.myAnswer,
      );
      if (status === "UNANSWERED" && hasAnswer) return false;
      if (status === "ANSWERED" && !hasAnswer) return false;
      return true;
    });
  }, [questions, debouncedSearch, status]);

  const activeCount = (search.trim() ? 1 : 0) + (status ? 1 : 0);
  const handleClear = () => {
    setSearch("");
    setStatus("");
  };

  const loadingContent = isLoading ? <VendorQnaSkeletonList /> : null;

  const errorContent = loadError ? (
    <p role="alert" className={styles.errorBox}>
      {loadError}
    </p>
  ) : null;

  const emptyContent =
    !isLoading && !loadError && !filteredQuestions.length ? (
      <p className={styles.emptyText}>{LABELS.noQuestionsFound}</p>
    ) : null;

  const listContent =
    !isLoading && !loadError && filteredQuestions.length > 0 ? (
      <VendorQnaList
        questions={filteredQuestions}
        onOpenAnswer={handleOpenAnswer}
      />
    ) : null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{LABELS.questionsAndAnswers}</h1>
          <p className={styles.hint}>{LABELS.vendorQnaHint}</p>
        </div>
      </div>

      {questions.length > 0 && (
        <CollapsibleTableFilters
          activeCount={activeCount}
          onClear={handleClear}
          resultCount={{
            count: filteredQuestions.length,
            total: questions.length,
          }}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 items-end">
            <FormFieldFrame label={LABELS.search} htmlFor="vendor-qna-search">
              <SearchInput
                id="vendor-qna-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch("")}
                placeholder="Search questions, answers, or products..."
              />
            </FormFieldFrame>

            <FormFieldFrame label={LABELS.status} htmlFor="vendor-qna-status">
              <Select
                value={status || "__ALL__"}
                onValueChange={(val) => setStatus(val === "__ALL__" ? "" : val)}
              >
                <SelectTrigger id="vendor-qna-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">All Questions</SelectItem>
                  <SelectItem value="UNANSWERED">Unanswered</SelectItem>
                  <SelectItem value="ANSWERED">Answered</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldFrame>
          </div>
        </CollapsibleTableFilters>
      )}

      {loadingContent}
      {errorContent}
      {emptyContent}
      {listContent}

      <VendorQnaAnswerDialog
        open={Boolean(targetId)}
        initialAnswer={initialAnswer}
        submitting={submitting}
        onOpenChange={handleAnswerOpenChange}
        onSubmit={handleAnswerSubmit}
      />
    </section>
  );
}
