import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupportTicketPriority } from "@/shared/constants/statuses";
import {
  supportTicketsApi,
  type CreateSupportTicketBody,
  type ReplySupportTicketBody,
} from "./supportTickets.api";
import { supportTicketKeys } from "./supportTickets.keys";

/** Refreshes the detail record plus every list after a ticket mutation. */
function useInvalidateTicket(id: string, includeMessages = false) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({
      queryKey: supportTicketKeys.detail(id),
    });
    if (includeMessages) {
      void queryClient.invalidateQueries({
        queryKey: supportTicketKeys.messages(id),
      });
    }
    void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
  };
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSupportTicketBody) =>
      supportTicketsApi.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: supportTicketKeys.all });
    },
  });
}

export function useReplySupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id, true);
  return useMutation({
    mutationFn: (body: ReplySupportTicketBody) =>
      supportTicketsApi.reply(id, body),
    onSuccess: invalidate,
  });
}

export function useResolveSupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: () => supportTicketsApi.resolve(id),
    onSuccess: invalidate,
  });
}

export function useReopenSupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: () => supportTicketsApi.reopen(id),
    onSuccess: invalidate,
  });
}

export function useCloseSupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: () => supportTicketsApi.close(id),
    onSuccess: invalidate,
  });
}

export function useReassignSupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: (assignedToId: string) =>
      supportTicketsApi.reassign(id, assignedToId),
    onSuccess: invalidate,
  });
}

export function useUpdateTicketPriority(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: (priority: SupportTicketPriority) =>
      supportTicketsApi.updatePriority(id, priority),
    onSuccess: invalidate,
  });
}

export function useEscalateSupportTicket(id: string) {
  const invalidate = useInvalidateTicket(id);
  return useMutation({
    mutationFn: () => supportTicketsApi.escalate(id),
    onSuccess: invalidate,
  });
}

export function useRateSupportTicket(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rating: number) => supportTicketsApi.rate(id, rating),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: supportTicketKeys.detail(id),
      });
    },
  });
}
