"use client";

import type { ChangeEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { FilterChipGroup } from "@/shared/components/listing/FilterChipGroup.component";
import { SortSelect } from "@/shared/components/listing/SortSelect.component";
import { LABELS } from "@/shared/constants/labels";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";
import {
  ANSWERED_FILTER_OPTIONS,
  QUESTION_SORT_OPTIONS,
} from "../../constants/productQna.constants";
import type {
  AnsweredFilter,
  QuestionSort,
} from "../../types/productQna.types";

interface AllQuestionsToolbarProps {
  search: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  answered: AnsweredFilter;
  onAnsweredChange: (value: AnsweredFilter) => void;
  sort: QuestionSort;
  onSortChange: (value: QuestionSort) => void;
}

/** Search on top; answered-state chips and sort below. */
export function AllQuestionsToolbar({
  search,
  onSearchChange,
  answered,
  onAnsweredChange,
  sort,
  onSortChange,
}: AllQuestionsToolbarProps) {
  return (
    <div className={styles.toolbarStack}>
      <div role="search" className={styles.searchWrap}>
        <Search className={styles.searchIcon} aria-hidden />
        <Input
          type="search"
          value={search}
          onChange={onSearchChange}
          aria-label={LABELS.questionSearchLabel}
          placeholder={LABELS.questionSearchPlaceholder}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.toolbarRow}>
        <FilterChipGroup
          label={LABELS.questionFilterLabel}
          options={ANSWERED_FILTER_OPTIONS}
          value={answered}
          onChange={onAnsweredChange}
        />
        <SortSelect
          options={QUESTION_SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
}
