import { useMemo } from "react";
import { type DataTableColumn } from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { SupportTicket } from "../../api/list/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../../utils/detail/labels";
import { ticketListStyles } from "../../styles/list/ticketList.styles";

interface UseTicketTableColumnsParams {
  showCustomer?: boolean;
  showVendor?: boolean;
}

export function useTicketTableColumns({
  showCustomer,
  showVendor,
}: UseTicketTableColumnsParams): DataTableColumn<SupportTicket>[] {
  return useMemo(() => {
    const cols: DataTableColumn<SupportTicket>[] = [
      {
        id: "ticketNumber",
        header: LABELS.ticketNumber,
        cell: (row) => (
          <span className={ticketListStyles.ticketNumberCell}>
            {row.hasUnread ? (
              <span
                className={ticketListStyles.unreadDot}
                title={LABELS.ticketHasUnread}
              />
            ) : null}
            {row.ticketNumber}
          </span>
        ),
        className: "whitespace-nowrap",
      },
      {
        id: "subject",
        header: LABELS.ticketSubject,
        cell: (row) => (
          <div className={ticketListStyles.subjectWrapper}>
            <p className={ticketListStyles.subjectText}>{row.subject}</p>
            {row.latestMessagePreview ? (
              <p className={ticketListStyles.previewText}>
                {row.latestMessagePreview}
              </p>
            ) : null}
          </div>
        ),
        truncate: false,
      },
    ];

    if (showCustomer) {
      cols.push({
        id: "customerName",
        header: LABELS.ticketCustomer,
        cell: (row: SupportTicket) => row.customerName || LABELS.emptyCell,
      });
    }

    if (showVendor) {
      cols.push({
        id: "vendorName",
        header: LABELS.ticketVendor,
        cell: (row: SupportTicket) => row.vendorName || LABELS.emptyCell,
        hideOnMobile: true,
      });
    }

    cols.push(
      {
        id: "category",
        header: LABELS.category,
        cell: (row) => TICKET_CATEGORY_LABEL[row.category],
        hideOnMobile: true,
      },
      {
        id: "priority",
        header: LABELS.priority,
        cell: (row) => (
          <StatusBadge
            status={row.priority}
            label={TICKET_PRIORITY_LABEL[row.priority]}
          />
        ),
      },
      {
        id: "status",
        header: LABELS.status,
        cell: (row) => (
          <StatusBadge
            status={row.status}
            label={TICKET_STATUS_LABEL[row.status]}
          />
        ),
      },
      {
        id: "createdAt",
        header: LABELS.createdAt,
        cell: (row) => formatOrderDate(row.createdAt),
        hideOnMobile: true,
      },
    );

    return cols;
  }, [showCustomer, showVendor]);
}
