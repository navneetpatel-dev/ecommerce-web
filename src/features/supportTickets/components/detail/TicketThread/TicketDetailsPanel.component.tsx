import { Button } from "@/shared/components/ui/button";
import { FormError } from "@/shared/components/FormError.component";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { LABELS } from "@/shared/constants/labels";
import { formatOrderDate } from "@/shared/utils/formatting/orderFormat";
import type { SupportTicket } from "../../../api/list/supportTickets.api";
import {
  TICKET_CATEGORY_LABEL,
  TICKET_PRIORITY_LABEL,
  TICKET_STATUS_LABEL,
} from "../../../utils/detail/labels";
import { AttachmentThumbs } from "./TicketAttachmentThumbs.component";
import { TicketManageControls } from "./TicketManageControls.component";
import { ticketDetailsPanelStyles as styles } from "../../../styles/detail/ticketDetailsPanel.styles";

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
      <div className={styles.header}>
        <TextEyebrow brand>{LABELS.ticketAboutTicket}</TextEyebrow>
      </div>

      <div className={styles.content}>
        <dl className={styles.list}>
          <div className={styles.row}>
            <dt className={styles.label}>{LABELS.status}</dt>
            <dd>
              <StatusBadge
                status={ticket.status}
                label={TICKET_STATUS_LABEL[ticket.status]}
              />
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>{LABELS.priority}</dt>
            <dd>
              <StatusBadge
                status={ticket.priority}
                label={TICKET_PRIORITY_LABEL[ticket.priority]}
              />
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.label}>{LABELS.category}</dt>
            <dd className={styles.valBold}>
              {TICKET_CATEGORY_LABEL[ticket.category]}
            </dd>
          </div>
          <div className={styles.rowDivided}>
            <dt className={styles.label}>{LABELS.createdAt}</dt>
            <dd className={styles.valText}>
              {formatOrderDate(ticket.createdAt)}
            </dd>
          </div>
          {ticket.assignedToName || ticket.assignedToId ? (
            <div className={styles.row}>
              <dt className={styles.label}>{LABELS.ticketAssignee}</dt>
              <dd className={styles.valTruncated}>
                {ticket.assignedToName || LABELS.ticketAssigneeNone}
              </dd>
            </div>
          ) : null}
          {ticket.relatedOrderId ? (
            <div className={styles.row}>
              <dt className={styles.label}>{LABELS.ticketOrderSection}</dt>
              <dd className={styles.valMono}>
                #{ticket.relatedOrderId.slice(0, 8)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className={styles.sectionDivided}>
          <TextEyebrow>{LABELS.ticketOriginalRequest}</TextEyebrow>
          <p className={styles.requestText}>{ticket.description}</p>
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
          <div className={styles.actionsRow}>
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
