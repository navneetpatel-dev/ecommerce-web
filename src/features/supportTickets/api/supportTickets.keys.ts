import { useAuthStore } from "@/shared/stores/auth.store";
import type { TicketListParams } from "./supportTickets.api";

/** Centralized cache keys for support-ticket queries. */
export const supportTicketKeys = {
  all: ["supportTickets"] as const,
  mine: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, "mine", filters] as const,
  vendor: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, "vendor", filters] as const,
  admin: (filters: TicketListParams = {}) =>
    [...supportTicketKeys.all, "admin", filters] as const,
  detail: (id: string) => [...supportTicketKeys.all, "detail", id] as const,
  messages: (id: string) => [...supportTicketKeys.all, "messages", id] as const,
};

/** Ticket endpoints are auth-gated across every consumer hook. */
export function useTicketQueryEnabled() {
  return Boolean(useAuthStore((s) => s.accessToken));
}
