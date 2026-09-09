import { useCallback } from "react";
import { useRouter } from "next/navigation";
import type { SupportTicket } from "../api/supportTickets.api";

export function useTicketListHandlers(detailHref: (id: string) => string) {
  const router = useRouter();

  const handleRowClick = useCallback(
    (row: SupportTicket) => {
      router.push(detailHref(row.id));
    },
    [detailHref, router],
  );

  const getRowId = useCallback((row: SupportTicket) => row.id, []);

  return {
    handleRowClick,
    getRowId,
  };
}
