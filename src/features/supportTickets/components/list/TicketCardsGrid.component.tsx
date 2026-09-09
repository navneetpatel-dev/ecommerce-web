import type { SupportTicket } from "../../api/list/supportTickets.api";
import { ticketCardListStyles } from "../../styles/list/ticketCardList.styles";
import { TicketCardItem } from "./TicketCardItem.component";

interface TicketCardsGridProps {
  tickets: SupportTicket[];
  detailHref: (id: string) => string;
}

export function TicketCardsGrid({ tickets, detailHref }: TicketCardsGridProps) {
  return (
    <ul className={ticketCardListStyles.grid}>
      {tickets.map((ticket) => (
        <TicketCardItem
          key={ticket.id}
          ticket={ticket}
          href={detailHref(ticket.id)}
        />
      ))}
    </ul>
  );
}
