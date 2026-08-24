import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/orderFormat";
import type { SupportTicket } from "../../api/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../../utils/labels";
import { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
import { TicketManageControls } from "./TicketManageControls.component";

interface TicketDetailsPanelProps {
  ticket: SupportTicket;
  showResolve: boolean;
  canReopen: boolean;
  canManage: boolean;
  resolvePending: boolean;
  reopenPending: boolean;
  closePending: boolean;
  onResolve: () => void;
  onReopen: () => void;
  onClose: () => void;
  assigneeId: string;
  onAssigneeChange: (id: string) => void;
  reassignPending: boolean;
  onReassign: () => void;
  priority: SupportTicket["priority"];
  onPriorityChange: (priority: SupportTicket["priority"]) => void;
  priorityPending: boolean;
  onSavePriority: () => void;
  escalatePending: boolean;
  onEscalate: () => void;
  actionError: string | null;
}

export function TicketDetailsPanel(props: TicketDetailsPanelProps) {
  const { ticket, canManage } = props;

  return (
    <>
      <div className="border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5">
        <TextEyebrow brand>{LABELS.ticketAboutTicket}</TextEyebrow>
      </div>

      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
        <dl className="grid gap-3 text-body-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.status}</dt>
            <dd>
              <StatusBadge
                status={ticket.status}
                label={TICKET_STATUS_LABEL[ticket.status]}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.priority}</dt>
            <dd>
              <StatusBadge
                status={ticket.priority}
                label={TICKET_PRIORITY_LABEL[ticket.priority]}
              />
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{LABELS.category}</dt>
            <dd className="font-medium text-ink">
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line/60 pt-3">
            <dt className="text-ink-muted">{LABELS.createdAt}</dt>
            <dd className="text-ink">{formatOrderDate(ticket.createdAt)}</dd>
          </div>
          {ticket.assignedToName || ticket.assignedToId ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{LABELS.ticketAssignee}</dt>
              <dd className="truncate text-ink">
                {ticket.assignedToName || LABELS.ticketAssigneeNone}
              </dd>
            </div>
          ) : null}
          {ticket.relatedOrderId ? (
            <div className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{LABELS.ticketOrderSection}</dt>
              <dd className="font-mono text-[0.75rem] text-ink">
                #{ticket.relatedOrderId.slice(0, 8)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="border-t border-line/60 pt-4">
          <TextEyebrow>{LABELS.ticketOriginalRequest}</TextEyebrow>
          <p className="mt-2 whitespace-pre-wrap text-body-sm leading-relaxed text-ink-muted">
            {ticket.description}
          </p>
          <AttachmentThumbs attachments={ticket.attachments ?? []} />
        </div>

        {canManage ? (
          <TicketManageControls
            ticket={ticket}
            priority={props.priority}
            onPriorityChange={props.onPriorityChange}
            priorityPending={props.priorityPending}
            onSavePriority={props.onSavePriority}
            escalatePending={props.escalatePending}
            onEscalate={props.onEscalate}
            assigneeId={props.assigneeId}
            onAssigneeChange={props.onAssigneeChange}
            reassignPending={props.reassignPending}
            onReassign={props.onReassign}
          />
        ) : null}

        {props.actionError ? (
          <FormError
            error={new Error(props.actionError)}
            fallback={props.actionError}
          />
        ) : null}

        {props.showResolve || props.canReopen || canManage ? (
          <div className="flex flex-wrap gap-2 border-t border-line/60 pt-4">
            {props.showResolve ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={props.resolvePending}
                onClick={props.onResolve}
              >
                {LABELS.ticketResolve}
              </Button>
            ) : null}
            {props.canReopen ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={props.reopenPending}
                onClick={props.onReopen}
              >
                {LABELS.ticketReopen}
              </Button>
            ) : null}
            {canManage ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                loading={props.closePending}
                onClick={props.onClose}
              >
                {LABELS.ticketClose}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
