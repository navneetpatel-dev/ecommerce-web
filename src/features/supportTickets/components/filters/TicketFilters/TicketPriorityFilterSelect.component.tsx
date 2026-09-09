import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { SUPPORT_TICKET_PRIORITY_VALUES } from "@/shared/constants/statuses";
import { TICKET_PRIORITY_LABEL } from "../../../utils/detail/labels";
import { ALL } from "../../../hooks/filters/useTicketFiltersHandlers.hook";

interface TicketPriorityFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TicketPriorityFilterSelect({
  value,
  onChange,
}: TicketPriorityFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.priority}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.ticketFilterAllPriorities} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>
            {LABELS.ticketFilterAllPriorities}
          </SelectItem>
          {SUPPORT_TICKET_PRIORITY_VALUES.map((priority) => (
            <SelectItem key={priority} value={priority}>
              {TICKET_PRIORITY_LABEL[priority]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
