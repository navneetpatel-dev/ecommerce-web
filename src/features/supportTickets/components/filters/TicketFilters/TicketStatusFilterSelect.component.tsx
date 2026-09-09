import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { SUPPORT_TICKET_STATUS_VALUES } from "@/shared/constants/statuses";
import { TICKET_STATUS_LABEL } from "../../../utils/detail/labels";
import { ALL } from "./useTicketFiltersHandlers.hook";

interface TicketStatusFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TicketStatusFilterSelect({
  value,
  onChange,
}: TicketStatusFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.status}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.ticketFilterAllStatuses} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{LABELS.ticketFilterAllStatuses}</SelectItem>
          {SUPPORT_TICKET_STATUS_VALUES.map((status) => (
            <SelectItem key={status} value={status}>
              {TICKET_STATUS_LABEL[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
