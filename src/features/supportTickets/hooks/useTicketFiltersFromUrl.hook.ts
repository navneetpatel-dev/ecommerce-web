import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  SUPPORT_TICKET_CATEGORY_VALUES,
  SUPPORT_TICKET_PRIORITY_VALUES,
  SUPPORT_TICKET_STATUS_VALUES,
  type SupportTicketCategory,
  type SupportTicketPriority,
  type SupportTicketStatus,
} from "@/shared/constants/statuses";
import type { TicketListParams } from "../api/supportTickets.api";

export function useTicketFiltersFromUrl(): TicketListParams {
  const searchParams = useSearchParams();
  return useMemo(() => {
    const status = searchParams.get("status") as SupportTicketStatus | null;
    const priority = searchParams.get(
      "priority",
    ) as SupportTicketPriority | null;
    const category = searchParams.get(
      "category",
    ) as SupportTicketCategory | null;
    const vendorId = searchParams.get("vendorId");
    return {
      status:
        status && SUPPORT_TICKET_STATUS_VALUES.includes(status)
          ? status
          : undefined,
      priority:
        priority && SUPPORT_TICKET_PRIORITY_VALUES.includes(priority)
          ? priority
          : undefined,
      category:
        category && SUPPORT_TICKET_CATEGORY_VALUES.includes(category)
          ? category
          : undefined,
      vendorId: vendorId || undefined,
    };
  }, [searchParams]);
}
