import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { supportTicketsApi, type TicketListParams } from "./supportTickets.api";
import {
  supportTicketKeys,
  useTicketQueryEnabled,
} from "./supportTickets.keys";

export function useMyTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useTicketQueryEnabled();
  return useInfiniteQuery({
    queryKey: supportTicketKeys.mine(filters),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listMine({
        ...filters,
        limit: filters.limit ?? DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled,
  });
}

export function useVendorTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useTicketQueryEnabled();
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
  });
}

export function useAdminTicketsInfinite(filters: TicketListParams = {}) {
  const enabled = useTicketQueryEnabled();
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
  });
}

/** Fetches a single ticket; disabled until a real id is provided. */
export function useSupportTicket(id: string) {
  const enabled = useTicketQueryEnabled();
  return useQuery({
    queryKey: supportTicketKeys.detail(id),
    queryFn: () => supportTicketsApi.getById(id),
    enabled: enabled && Boolean(id),
  });
}

export function useTicketMessagesInfinite(id: string) {
  const enabled = useTicketQueryEnabled();
  return useInfiniteQuery({
    queryKey: supportTicketKeys.messages(id),
    queryFn: ({ pageParam }) =>
      supportTicketsApi.listMessages(id, {
        limit: DEFAULT_PAGE_LIMIT,
        cursor: pageParam,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: enabled && Boolean(id),
  });
}
