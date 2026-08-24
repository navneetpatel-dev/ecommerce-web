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

/** Back link, subject and status/priority badges. */
export function TicketThreadHeader({
  ticket,
  mode,
}: {
  ticket: SupportTicket;
  mode: RoleMode;
}) {
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Link
          href={listHref(mode)}
          className="inline-flex items-center gap-1 text-body-sm text-ink-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          {LABELS.ticketBackToList}
        </Link>
        <span className="font-mono text-[0.6875rem] tabular-nums text-ink-faint">
          {ticket.ticketNumber}
        </span>
      </div>

      <div className="min-w-0">
        <h1 className="font-display text-[1.25rem] font-semibold leading-tight tracking-tight text-ink sm:text-[1.375rem]">
          {ticket.subject}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge
            status={ticket.status}
            label={TICKET_STATUS_LABEL[ticket.status]}
          />
          <StatusBadge
            status={ticket.priority}
            label={TICKET_PRIORITY_LABEL[ticket.priority]}
          />
          <span className="text-[0.75rem] text-ink-muted">
            {TICKET_CATEGORY_LABEL[ticket.category]}
            {" · "}
            {formatOrderDate(ticket.createdAt)}
          </span>
        </div>
      </div>
    </header>
  );
}
