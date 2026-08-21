import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/shared/stores/auth.store";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import type {
  BugAffectedModule,
  BugReportSeverity,
  BugReportStatus,
} from "@/shared/constants/statuses";
import {
  bugReportsApi,
  type BugListParams,
  type CreateBugReportBody,
} from "./bugReports.api";

export const bugReportKeys = {
  all: ["bugReports"] as const,
  mine: (filters: BugListParams = {}) =>
    [...bugReportKeys.all, "mine", filters] as const,
  admin: (filters: BugListParams = {}) =>
    [...bugReportKeys.all, "admin", filters] as const,
  detail: (id: string) => [...bugReportKeys.all, "detail", id] as const,
  comments: (id: string) => [...bugReportKeys.all, "comments", id] as const,
};

function useEnabled() {
  return Boolean(useAuthStore((s) => s.accessToken));
}

export function useMyBugReportsInfinite(filters: BugListParams = {}) {
  const enabled = useEnabled();
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
  const enabled = useEnabled();
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

export function useBugReport(id: string) {
  const enabled = useEnabled();
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
  const authEnabled = useEnabled();
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

export function useCreateBugReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      body: CreateBugReportBody;
      pageUrl?: string | null;
    }) => bugReportsApi.create(input.body, input.pageUrl),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useTriageBugReport(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      severity: BugReportSeverity;
      affectedModule: BugAffectedModule;
      assignedToId?: string | null;
    }) => bugReportsApi.triage(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useUpdateBugAssignment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      severity: BugReportSeverity;
      affectedModule: BugAffectedModule;
      assignedToId?: string | null;
    }) => bugReportsApi.updateAssignment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useUpdateBugStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: BugReportStatus) =>
      bugReportsApi.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useMarkBugDuplicate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (duplicateOf: string) =>
      bugReportsApi.markDuplicate(id, duplicateOf),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useWontFixBug(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => bugReportsApi.wontFix(id, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useVerifyBug(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => bugReportsApi.verify(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
      void queryClient.invalidateQueries({ queryKey: bugReportKeys.all });
    },
  });
}

export function useAddBugComment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => bugReportsApi.addComment(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.comments(id),
      });
      void queryClient.invalidateQueries({
        queryKey: bugReportKeys.detail(id),
      });
    },
  });
}
