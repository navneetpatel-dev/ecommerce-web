export type InfiniteSingleSelectOption = {
  id: string;
  label: string;
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
