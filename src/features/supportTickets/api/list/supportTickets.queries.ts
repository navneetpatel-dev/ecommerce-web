/**
 * Public query surface for support tickets. Split by responsibility
 * (keys / reads / writes) under Rule 3; consumers keep this single import.
 */
export {
  supportTicketKeys,
  useTicketQueryEnabled,
} from "./supportTickets.keys";

export {
  useMyTicketsInfinite,
  useVendorTicketsInfinite,
  useAdminTicketsInfinite,
  useSupportTicket,
  useTicketMessagesInfinite,
} from "./supportTickets.list.queries";

export {
  useCreateSupportTicket,
  useReplySupportTicket,
  useResolveSupportTicket,
  useReopenSupportTicket,
  useCloseSupportTicket,
  useReassignSupportTicket,
  useUpdateTicketPriority,
  useEscalateSupportTicket,
  useRateSupportTicket,
} from "../detail/supportTickets.mutations";
