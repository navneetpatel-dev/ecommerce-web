import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import type { SupportTicketPriority } from '@/shared/constants/statuses'
import {
  supportTicketsApi,
  type CreateSupportTicketBody,
  type ReplySupportTicketBody,
  type TicketListParams,
} from './supportTickets.api'

export const supportTicketKeys = {
  all: ['supportTickets'] as const,
  mine: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, 'mine', filters] as const,
  vendor: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, 'vendor', filters] as const,
  admin: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, 'admin', filters] as const,
  detail: (id: string) => [...supportTicketKeys.all, 'detail', id] as const,
  messages: (id: string) => [...supportTicketKeys.all, 'messages', id] as const,
}

function useEnabled() {
  return Boolean(useAuthStore((s) => s.accessToken))
}

export function useMyTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useEnabled()
  return useInfiniteQuery({
    queryKey: supportTicketKeys.mine(filters),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listMine({ ...filters, limit: filters.limit ?? DEFAULT_PAGE_LIMIT, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  })
}

export function useVendorTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useEnabled()
  return useInfiniteQuery({
    queryKey: supportTicketKeys.vendor(filters),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listVendor({
        ...filters,
        limit: filters.limit ?? DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  })
}

export function useAdminTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useEnabled()
  return useInfiniteQuery({
    queryKey: supportTicketKeys.admin(filters),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listAdmin({
        ...filters,
        limit: filters.limit ?? DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  })
}

export function useSupportTicket(id: string) {
  const enabled = useEnabled()
  return useQuery({
    queryKey: supportTicketKeys.detail(id),
    queryFn: () => supportTicketsApi.getById(id),
    enabled: enabled && Boolean(id),
  })
}

export function useTicketMessagesInfinite(id: string) {
  const enabled = useEnabled()
  return useInfiniteQuery({
    queryKey: supportTicketKeys.messages(id),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listMessages(id, { limit: DEFAULT_PAGE_LIMIT, cursor: pageParam }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && Boolean(id),
  })
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateSupportTicketBody) => supportTicketsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useReplySupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: ReplySupportTicketBody) => supportTicketsApi.reply(id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.messages(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useResolveSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => supportTicketsApi.resolve(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useReopenSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => supportTicketsApi.reopen(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useCloseSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => supportTicketsApi.close(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useReassignSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (assignedToId: string) => supportTicketsApi.reassign(id, assignedToId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useUpdateTicketPriority(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (priority: SupportTicketPriority) => supportTicketsApi.updatePriority(id, priority),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useEscalateSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => supportTicketsApi.escalate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all })
    },
  })
}

export function useRateSupportTicket(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (rating: number) => supportTicketsApi.rate(id, rating),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.detail(id) })
    },
  })
}
