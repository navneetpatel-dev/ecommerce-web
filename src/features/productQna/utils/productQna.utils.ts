import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type {
  AnsweredFilter,
  QnaSummary,
  QuestionSort,
} from "../types/productQna.types";

export const EMPTY_QNA_SUMMARY: QnaSummary = { total: 0, answered: 0 };

/** Reads `meta.summary` defensively — an older backend sends none. */
export function readQnaSummary(raw: unknown): QnaSummary {
  if (!raw || typeof raw !== "object") return EMPTY_QNA_SUMMARY;
  const value = raw as Partial<QnaSummary>;
  return {
    total: Number(value.total ?? 0),
    answered: Number(value.answered ?? 0),
  };
}

export function answeredPercent(summary: QnaSummary): number {
  return summary.total
    ? Math.round((summary.answered / summary.total) * 100)
    : 0;
}

export function qnaSummaryText(summary: QnaSummary): string {
  return formatLabel(LABELS.qnaSummary, {
    total: summary.total.toLocaleString("en-IN"),
    answered: summary.answered.toLocaleString("en-IN"),
  });
}

export function moreAnswersLabel(count: number): string {
  return count === 1
    ? LABELS.seeOneMoreAnswer
    : formatLabel(LABELS.seeMoreAnswers, {
        count: count.toLocaleString("en-IN"),
      });
}

export function answerCountLabel(count: number): string {
  return count === 1
    ? LABELS.answerCountOne
    : formatLabel(LABELS.answerCount, { count: count.toLocaleString("en-IN") });
}

const SORTS: readonly QuestionSort[] = ["recent", "oldest", "most_answered"];
export function parseQuestionSort(
  raw: string | null,
): QuestionSort | undefined {
  return SORTS.includes(raw as QuestionSort)
    ? (raw as QuestionSort)
    : undefined;
}

const ANSWERED: readonly AnsweredFilter[] = ["all", "answered", "unanswered"];
export function parseAnsweredFilter(raw: string | null): AnsweredFilter {
  return ANSWERED.includes(raw as AnsweredFilter)
    ? (raw as AnsweredFilter)
    : "all";
}
