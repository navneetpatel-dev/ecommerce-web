import type { ReactNode } from "react";

export type InfiniteSingleSelectOption = {
  id: string;
  label: string;
  sublabel?: string;
  /** Whatever the caller needs to draw the row or act on the choice (see `renderOption`, `onSelectOption`). */
  data?: unknown;
};

export type InfiniteSingleSelectPageQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type InfiniteSingleSelectPageResult = {
  items: InfiniteSingleSelectOption[];
  page: number;
  totalPages: number;
  total: number;
};

export interface InfiniteSingleSelectProps {
  value: string;
  onChange: (id: string) => void;
  /** Called with the chosen option itself (not for "none"), for callers that need more than the id. */
  onSelectOption?: (option: InfiniteSingleSelectOption) => void;
  /** Draws a row's content instead of the default label and sublabel. */
  renderOption?: (option: InfiniteSingleSelectOption) => ReactNode;
  /** When false the selected option only labels the closed field; it is not added to the top of the list. Default true. */
  pinnedInList?: boolean;
  /** Fetch one page. Must return server pagination meta so infinite scroll can continue. */
  fetchPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
  /**
   * When this changes, the list resets and reloads from page 1
   * (e.g. permission scope).
   */
  resetKey?: string | number | null;
  /** Keep a selected option visible even if they are not in loaded pages. */
  pinnedOption?: InfiniteSingleSelectOption | null;
  allowNone?: boolean;
  noneValue?: string;
  noneLabel?: string;
  /** Closed-trigger label when nothing is selected. */
  placeholder?: string;
  searchPlaceholder?: string;
  /** When false, hides the search field (for APIs without search). Default true. */
  searchable?: boolean;
  emptyMessage?: string;
  error?: boolean;
  disabled?: boolean;
  pageSize?: number;
  className?: string;
  listClassName?: string;
}

export interface UseInfiniteSelectOptionsArgs {
  open: boolean;
  disabled: boolean;
  fetchPage: (
    query: InfiniteSingleSelectPageQuery,
  ) => Promise<InfiniteSingleSelectPageResult>;
  pinnedOption: InfiniteSingleSelectOption | null;
  pageSize: number;
  searchable: boolean;
}
