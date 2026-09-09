import Link from "next/link";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { SupportTicket } from "../../api/list/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../../utils/detail/labels";
import { ticketCardListStyles } from "./ticketCardList.styles";

interface TicketCardItemProps {
  ticket: SupportTicket;
  href: string;
}

export function TicketCardItem({ ticket, href }: TicketCardItemProps) {
  return (
    <li className={ticketCardListStyles.itemWrapper}>
      <Link href={href} className={ticketCardListStyles.card}>
        <div className={ticketCardListStyles.cardContent}>
          <div className={ticketCardListStyles.badgesRow}>
            {ticket.hasUnread ? (
              <span
                className={ticketCardListStyles.unreadDot}
                title={LABELS.ticketHasUnread}
                aria-label={LABELS.ticketHasUnread}
              />
            ) : null}
            <span className={ticketCardListStyles.ticketNumber}>
              {ticket.ticketNumber}
            </span>
            <StatusBadge
              status={ticket.status}
              label={TICKET_STATUS_LABEL[ticket.status]}
            />
            <StatusBadge
              status={ticket.priority}
              label={TICKET_PRIORITY_LABEL[ticket.priority]}
            />
          </div>
          <p className={ticketCardListStyles.subject}>{ticket.subject}</p>
          {ticket.latestMessagePreview ? (
            <p className={ticketCardListStyles.preview}>
              {ticket.latestMessagePreview}
            </p>
          ) : null}
          <p className={ticketCardListStyles.meta}>
            {TICKET_CATEGORY_LABEL[ticket.category]} ·{" "}
            {formatOrderDate(ticket.createdAt)}
          </p>
        </div>
      </Link>
    </li>
  );
}
