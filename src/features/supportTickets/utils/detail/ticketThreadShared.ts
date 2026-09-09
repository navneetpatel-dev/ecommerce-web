import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { TICKET_SENDER_ROLE } from "@/shared/constants/statuses";

export type RoleMode = "customer" | "vendor" | "admin";

export function initials(name: string | null | undefined): string {
  if (!name?.trim()) return LABELS.ticketAvatarInitialsFallback;
  const parts = name.trim().split(/\s+/);
  return (
    ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() ||
    LABELS.ticketAvatarInitialsFallback
  );
}

export function isStaffRole(role: string): boolean {
  return role !== TICKET_SENDER_ROLE.CUSTOMER;
}

export function listHref(mode: RoleMode): string {
  if (mode === "admin") return PATHS.admin.supportTickets;
  if (mode === "vendor") return PATHS.vendor.supportTickets;
  return PATHS.supportTickets;
}
