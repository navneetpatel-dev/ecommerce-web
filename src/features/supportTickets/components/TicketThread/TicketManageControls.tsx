import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormFieldFrame } from "@/shared/components/forms";
import { AssigneeSelect } from "@/shared/components/AssigneeSelect";
import { LABELS } from "@/shared/constants/labels";
import { PERMISSIONS } from "@/shared/constants/permissions";
import {
  SUPPORT_TICKET_PRIORITY,
  SUPPORT_TICKET_PRIORITY_VALUES,
  type SupportTicketPriority,
} from "@/shared/constants/statuses";
import type { SupportTicket } from "../../api/supportTickets.api";
import { TICKET_PRIORITY_LABEL } from "../../utils/labels";

interface TicketManageControlsProps {
  ticket: SupportTicket;
  priority: SupportTicketPriority;
  onPriorityChange: (priority: SupportTicketPriority) => void;
  priorityPending: boolean;
  onSavePriority: () => void;
  escalatePending: boolean;
  onEscalate: () => void;
  assigneeId: string;
  onAssigneeChange: (id: string) => void;
  reassignPending: boolean;
  onReassign: () => void;
}

/** Priority + assignee management blocks shown to staff (canManage). */
export function TicketManageControls(props: TicketManageControlsProps) {
  const { ticket } = props;

  return (
    <>
      <div className="space-y-3 border-t border-line/60 pt-4">
        <FormFieldFrame label={LABELS.ticketUpdatePriority}>
          <Select
            value={props.priority}
            onValueChange={(v) =>
              props.onPriorityChange(v as SupportTicketPriority)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORT_TICKET_PRIORITY_VALUES.map((value) => (
                <SelectItem key={value} value={value}>
                  {TICKET_PRIORITY_LABEL[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={props.priorityPending}
            disabled={props.priority === ticket.priority}
            onClick={props.onSavePriority}
          >
            {LABELS.ticketUpdatePriority}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            loading={props.escalatePending}
            disabled={ticket.priority === SUPPORT_TICKET_PRIORITY.URGENT}
            onClick={props.onEscalate}
          >
            {LABELS.ticketEscalate}
          </Button>
        </div>
      </div>

      <div className="space-y-3 border-t border-line/60 pt-4">
        <FormFieldFrame label={LABELS.ticketAssignee}>
          <AssigneeSelect
            permission={PERMISSIONS.TICKET_MANAGE}
            value={props.assigneeId}
            onChange={props.onAssigneeChange}
            vendorId={ticket.relatedVendorId}
            currentOption={
              ticket.assignedToId
                ? {
                    id: ticket.assignedToId,
                    name: ticket.assignedToName || ticket.assignedToId,
                  }
                : null
            }
          />
        </FormFieldFrame>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          loading={props.reassignPending}
          disabled={
            !props.assigneeId.trim() ||
            props.assigneeId === (ticket.assignedToId ?? "")
          }
          onClick={props.onReassign}
        >
          {LABELS.ticketReassign}
        </Button>
      </div>
    </>
  );
}
