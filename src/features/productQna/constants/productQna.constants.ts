import { LABELS } from "@/shared/constants/labels";
import type { FilterChipOption } from "@/shared/components/listing/FilterChipGroup.component";
import type { AnsweredFilter, QuestionSort } from "../types/productQna.types";

/** The PDP shows the best-answered few; the rest live on the "all questions" page. */
export const PDP_QUESTION_PREVIEW_LIMIT = 5;
export const PDP_QUESTION_SORT: QuestionSort = "most_answered";
export const ALL_QUESTIONS_PAGE_LIMIT = 10;
export const DEFAULT_QUESTION_SORT: QuestionSort = "recent";
export const QUESTION_SEARCH_DEBOUNCE_MS = 350;
/** Answers per page when a question's thread is opened ("Load more answers"). */
export const ANSWER_THREAD_PAGE_SIZE = 10;
/** Answers longer than this start clamped to three lines with "Read more". */
export const ANSWER_CLAMP_CHARS = 220;

export const QUESTION_SORT_OPTIONS: readonly FilterChipOption<QuestionSort>[] =
  [
    { value: "recent", label: LABELS.questionSortRecent },
    { value: "most_answered", label: LABELS.questionSortMostAnswered },
    { value: "oldest", label: LABELS.questionSortOldest },
  ];

export const ANSWERED_FILTER_OPTIONS: readonly FilterChipOption<AnsweredFilter>[] =
  [
    { value: "all", label: LABELS.questionFilterAll },
    { value: "answered", label: LABELS.questionFilterAnswered },
    { value: "unanswered", label: LABELS.questionFilterUnanswered },
  ];

/** URL query keys on the all-questions page. */
export const QNA_QUERY = {
  page: "page",
  q: "q",
  answered: "answered",
  sort: "sort",
} as const;
