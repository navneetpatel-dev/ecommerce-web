import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { SupportTicket } from "../../api/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../../utils/labels";
import { listHref, type RoleMode } from "./ticketThreadShared";
import { ticketThreadStyles } from "./ticketThread.styles";

/** Back link, subject and status/priority badges. */
export function TicketThreadHeader({
  ticket,
  mode,
}: {
  ticket: SupportTicket;
  mode: RoleMode;
}) {
  return (
    <header className={ticketThreadStyles.header}>
      <div className={ticketThreadStyles.navRow}>
        <Link href={listHref(mode)} className={ticketThreadStyles.backLink}>
          <ArrowLeft
            className={ticketThreadStyles.backIcon}
            strokeWidth={1.5}
          />
          {LABELS.ticketBackToList}
        </Link>
        <span className={ticketThreadStyles.ticketId}>
          {ticket.ticketNumber}
        </span>
      </div>

      <div className={ticketThreadStyles.titleWrap}>
        <h1 className={ticketThreadStyles.title}>{ticket.subject}</h1>
        <div className={ticketThreadStyles.metaRow}>
          <StatusBadge
            status={ticket.status}
            label={TICKET_STATUS_LABEL[ticket.status]}
          />
          <StatusBadge
            status={ticket.priority}
            label={TICKET_PRIORITY_LABEL[ticket.priority]}
          />
          <span className={ticketThreadStyles.metaText}>
            {TICKET_CATEGORY_LABEL[ticket.category]}
            {" · "}
            {formatOrderDate(ticket.createdAt)}
          </span>
        </div>
      </div>
    </header>
  );
}
