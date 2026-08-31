import type { UseQueryResult } from "@tanstack/react-query";

type QueryDetailSlice<TData> = Pick<
  UseQueryResult<TData>,
  "data" | "isPending" | "isFetching" | "isError"
> & {
  error?: unknown;
};

export type ResolvedQueryDetailState<TData> = {
  data: TData | undefined;
  /** Show skeleton until the first resolved fetch (avoids empty-state flashes). */
  isLoading: boolean;
  /** Show not-found / empty UI only after loading finished with no data. */
  isEmpty: boolean;
  isError: boolean;
  error: unknown;
};

/**
 * React Query v5: `isLoading` can be false while `isPending` is still true
 * (before fetch starts), which flashes empty/not-found states on detail pages.
 */
export function resolveQueryDetailState<TData>(
  query: QueryDetailSlice<TData>,
  options?: { enabled?: boolean },
): ResolvedQueryDetailState<TData> {
  const enabled = options?.enabled ?? true;
  const isLoading =
    !enabled ||
    query.isPending ||
    (query.isFetching && query.data === undefined);
  const isEmpty = enabled && !isLoading && query.data == null;

  return {
    data: query.data,
    isLoading,
    isEmpty,
    isError: query.isError,
    error: query.error,
  };
}
