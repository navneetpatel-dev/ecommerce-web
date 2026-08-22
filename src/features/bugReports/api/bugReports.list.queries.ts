import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import {
  bugReportsApi,
  type BugListParams,
  type CreateBugReportBody,
} from "./bugReports.api";
import { bugReportKeys, useBugQueryEnabled } from "./bugReports.keys";

export function useMyBugReportsInfinite(filters: BugListParams = {}) {
  const enabled = useBugQueryEnabled();
  return useInfiniteQuery({
    queryKey: bugReportKeys.mine(filters),
    queryFn: ({ pageParam }) =>
      bugReportsApi.listMine({
        ...filters,
        limit: filters.limit ?? DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

export function useAdminBugReportsInfinite(filters: BugListParams = {}) {
  const enabled = useBugQueryEnabled();
  return useInfiniteQuery({
    queryKey: bugReportKeys.admin(filters),
    queryFn: ({ pageParam }) =>
      bugReportsApi.listAdmin({
        ...filters,
        limit: filters.limit ?? DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

/** Fetches a single bug report; disabled until a real id is provided. */
export function useBugReport(id: string) {
  const enabled = useBugQueryEnabled();
  return useQuery({
    queryKey: bugReportKeys.detail(id),
    queryFn: () => bugReportsApi.getById(id),
    enabled: enabled && Boolean(id),
  });
}

export function useBugCommentsInfinite(
  id: string,
  options: { enabled?: boolean } = {},
) {
  const authEnabled = useBugQueryEnabled();
  return useInfiniteQuery({
    queryKey: bugReportKeys.comments(id),
    queryFn: ({ pageParam }) =>
      bugReportsApi.listComments(id, {
        limit: DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: authEnabled && Boolean(id) && (options.enabled ?? true),
  });
}

/** Creates a bug report and refreshes both list surfaces. */
export function useCreateBugReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBugReportInput) =>
      bugReportsApi.create(input.body, input.pageUrl),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export interface CreateBugReportInput {
  body: CreateBugReportBody;
  pageUrl?: string | null;
}
