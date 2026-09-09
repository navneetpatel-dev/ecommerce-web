import { FormFieldFrame } from "@/shared/components/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { BUG_REPORT_STATUS_VALUES } from "@/shared/constants/statuses";
import { BUG_STATUS_LABEL } from "../../../utils/detail/labels";
import { ALL } from "../../../hooks/filters/useBugReportFiltersHandlers.hook";

interface BugStatusFilterSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function BugStatusFilterSelect({
  value,
  onChange,
}: BugStatusFilterSelectProps) {
  return (
    <FormFieldFrame label={LABELS.status}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={LABELS.ticketFilterAllStatuses} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{LABELS.ticketFilterAllStatuses}</SelectItem>
          {BUG_REPORT_STATUS_VALUES.map((status) => (
            <SelectItem key={status} value={status}>
              {BUG_STATUS_LABEL[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldFrame>
  );
}
