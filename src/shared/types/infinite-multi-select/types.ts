export type InfiniteMultiSelectOption = {
  id: string;
  label: string;
};

export type InfiniteMultiSelectPageQuery = {
  page: number;
  limit: number;
  search?: string;
};

export type InfiniteMultiSelectPageResult = {
  items: InfiniteMultiSelectOption[];
  page: number;
  totalPages: number;
  total: number;
};

export interface InfiniteMultiSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  /** Fetch one page. Must return server pagination meta so infinite scroll can continue. */
  fetchPage: (
    query: InfiniteMultiSelectPageQuery,
  ) => Promise<InfiniteMultiSelectPageResult>;
  /**
   * When this changes, the list resets and reloads from page 1
   * (e.g. scope type, vendor filter).
   */
  resetKey?: string | number | null;
  searchPlaceholder?: string;
  emptyMessage?: string;
  noneSelectedLabel?: string;
  selectedCountLabel?: string;
  error?: boolean;
  disabled?: boolean;
  pageSize?: number;
  className?: string;
  listClassName?: string;
  /** Prefix for option checkbox ids (avoid collisions when multiple pickers mount). */
  idPrefix?: string;
}
